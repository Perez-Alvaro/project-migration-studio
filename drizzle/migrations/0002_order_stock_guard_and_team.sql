create or replace function public.set_order_status(_order_id uuid, _status text)
returns void language plpgsql security definer set search_path = public as $$
declare _o record; _i record; _left integer;
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'No tenés permisos para esta acción.'; end if;
  if _status not in ('new','confirmed','delivered','cancelled') then raise exception 'Estado inválido.'; end if;
  select * into _o from public.orders where id = _order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if _status in ('confirmed','delivered') and not _o.stock_applied then
    for _i in select * from public.order_items where order_id = _order_id loop
      if _i.variant_id is not null then
        update public.product_variants set stock = stock - _i.quantity where id = _i.variant_id and stock >= _i.quantity returning stock into _left;
      elsif _i.product_id is not null then
        update public.products set stock = stock - _i.quantity where id = _i.product_id and stock >= _i.quantity returning stock into _left;
      else
        _left := 0;
      end if;
      if _left is null then raise exception 'No hay stock suficiente de «%». Ajustá el stock o el pedido antes de confirmarlo.', _i.name; end if;
      _left := null;
      insert into public.stock_movements (product_id, variant_id, delta, reason, order_id, created_by)
        values (_i.product_id, _i.variant_id, -_i.quantity, 'pedido ' || _o.code, _order_id, auth.uid());
    end loop;
    update public.orders set stock_applied = true where id = _order_id;
  elsif _status in ('new','cancelled') and _o.stock_applied then
    for _i in select * from public.order_items where order_id = _order_id loop
      if _i.variant_id is not null then
        update public.product_variants set stock = stock + _i.quantity where id = _i.variant_id;
      elsif _i.product_id is not null then
        update public.products set stock = stock + _i.quantity where id = _i.product_id;
      end if;
      insert into public.stock_movements (product_id, variant_id, delta, reason, order_id, created_by)
        values (_i.product_id, _i.variant_id, _i.quantity, 'devolución ' || _o.code, _order_id, auth.uid());
    end loop;
    update public.orders set stock_applied = false where id = _order_id;
  end if;
  update public.orders set status = _status, updated_at = now() where id = _order_id;
end $$;

create or replace function public.set_admin(_email text, _make_admin boolean)
returns void language plpgsql security definer set search_path = public as $$
declare _uid uuid;
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'No tenés permisos para esta acción.'; end if;
  select id into _uid from public.profiles where lower(email) = lower(trim(_email));
  if _uid is null then raise exception 'No encontramos una cuenta con ese correo. Pedile que se registre primero.'; end if;
  if _make_admin then
    insert into public.user_roles (user_id, role) values (_uid, 'admin') on conflict do nothing;
  else
    if _uid = auth.uid() then raise exception 'No podés quitarte tu propio acceso de administración.'; end if;
    delete from public.user_roles where user_id = _uid and role = 'admin';
  end if;
end $$;
revoke all on function public.set_admin(text, boolean) from public, anon;
grant execute on function public.set_admin(text, boolean) to authenticated;

create or replace function public.list_admins()
returns table (user_id uuid, email text, full_name text)
language sql stable security definer set search_path = public as $$
  select p.id, p.email, p.full_name from public.user_roles r join public.profiles p on p.id = r.user_id
  where r.role = 'admin' and public.has_role(auth.uid(), 'admin')
  order by p.email
$$;
revoke all on function public.list_admins() from public, anon;
grant execute on function public.list_admins() to authenticated;
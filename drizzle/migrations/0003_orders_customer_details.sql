ALTER TABLE public.orders
  ADD COLUMN customer_email text NOT NULL DEFAULT '',
  ADD COLUMN customer_dni text NOT NULL DEFAULT '',
  ADD COLUMN customer_address text NOT NULL DEFAULT '';

DROP FUNCTION IF EXISTS public.create_order(jsonb, text, text, text);

CREATE OR REPLACE FUNCTION public.create_order(
  _items jsonb,
  _customer_name text,
  _customer_phone text DEFAULT ''::text,
  _notes text DEFAULT ''::text,
  _customer_email text DEFAULT ''::text,
  _customer_dni text DEFAULT ''::text,
  _customer_address text DEFAULT ''::text
)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  _order_id uuid; _code text; _total numeric := 0; _it jsonb; _p record; _v record;
  _qty int; _price numeric; _name text; _avail int;
begin
  if coalesce(trim(_customer_name), '') = '' then raise exception 'Indicá tu nombre y apellido para registrar el pedido.'; end if;
  if coalesce(trim(_customer_email), '') = '' or position('@' in trim(_customer_email)) < 2 then raise exception 'Indicá un correo electrónico válido.'; end if;
  if coalesce(trim(_customer_phone), '') = '' then raise exception 'Indicá un teléfono de contacto.'; end if;
  if coalesce(trim(_customer_dni), '') = '' or trim(_customer_dni) !~ '^[0-9]{7,8}$' then raise exception 'Indicá un DNI válido (7 u 8 números, sin puntos).'; end if;
  if coalesce(trim(_customer_address), '') = '' then raise exception 'Indicá una dirección para el envío.'; end if;
  if jsonb_typeof(_items) <> 'array' or jsonb_array_length(_items) = 0 then raise exception 'El carrito está vacío.'; end if;
  if jsonb_array_length(_items) > 50 then raise exception 'Demasiados productos en un pedido.'; end if;
  _code := 'H-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
  insert into public.orders (code, customer_name, customer_phone, customer_email, customer_dni, customer_address, notes)
    values (
      _code,
      left(trim(_customer_name), 120),
      left(trim(_customer_phone), 40),
      left(lower(trim(_customer_email)), 160),
      left(trim(_customer_dni), 12),
      left(trim(_customer_address), 240),
      left(coalesce(_notes, ''), 1000)
    )
    returning id into _order_id;
  for _it in select * from jsonb_array_elements(_items) loop
    _qty := greatest(1, least(99, coalesce((_it->>'quantity')::int, 1)));
    select * into _p from public.products where id = (_it->>'product_id')::uuid and status = 'active';
    if not found then raise exception 'Uno de los productos ya no está disponible. Actualizá el carrito.'; end if;
    _price := _p.price; _name := _p.name; _avail := _p.stock;
    if (_it->>'variant_id') is not null then
      select * into _v from public.product_variants where id = (_it->>'variant_id')::uuid and product_id = _p.id;
      if not found then raise exception 'La variante elegida ya no existe. Actualizá el carrito.'; end if;
      _price := coalesce(_v.price, _p.price); _name := _p.name || ' — ' || _v.name; _avail := _v.stock;
    end if;
    if _avail < _qty then raise exception 'No hay stock suficiente de %. Quedan % unidades.', _name, greatest(_avail, 0); end if;
    insert into public.order_items (order_id, product_id, variant_id, name, unit_price, quantity)
      values (_order_id, _p.id, (_it->>'variant_id')::uuid, _name, _price, _qty);
    _total := _total + _price * _qty;
  end loop;
  update public.orders set total = _total where id = _order_id;
  return _code;
end; $function$;
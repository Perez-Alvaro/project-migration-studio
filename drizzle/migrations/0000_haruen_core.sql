-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Ver roles propios o todos si admin" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Perfil propio o admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Editar perfil propio" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position numeric not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "Categorias publicas" on public.categories for select to anon, authenticated using (true);
create policy "Admins gestionan categorias" on public.categories for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price numeric(12,2) not null default 0 check (price >= 0),
  compare_at_price numeric(12,2),
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  stock integer not null default 0,
  low_stock_threshold integer not null default 2,
  position numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "Productos activos publicos" on public.products for select to anon, authenticated
  using (status = 'active' or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan productos" on public.products for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger products_updated before update on public.products for each row execute function public.touch_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  position numeric not null default 0
);
grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;
grant all on public.product_images to service_role;
alter table public.product_images enable row level security;
create policy "Imagenes de productos visibles" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'active' or public.has_role(auth.uid(), 'admin'))));
create policy "Admins gestionan imagenes" on public.product_images for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(12,2),
  stock integer not null default 0,
  position numeric not null default 0
);
grant select on public.product_variants to anon, authenticated;
grant insert, update, delete on public.product_variants to authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;
create policy "Variantes visibles" on public.product_variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'active' or public.has_role(auth.uid(), 'admin'))));
create policy "Admins gestionan variantes" on public.product_variants for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  customer_name text not null,
  customer_phone text not null default '',
  notes text not null default '',
  status text not null default 'new' check (status in ('new','confirmed','delivered','cancelled')),
  total numeric(12,2) not null default 0,
  stock_applied boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "Admins ven pedidos" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins editan pedidos" on public.orders for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins borran pedidos" on public.orders for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
create trigger orders_updated before update on public.orders for each row execute function public.touch_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  name text not null,
  unit_price numeric(12,2) not null,
  quantity integer not null check (quantity > 0)
);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "Admins ven items" on public.order_items for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  delta integer not null,
  reason text not null default 'ajuste',
  order_id uuid references public.orders(id) on delete set null,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select on public.stock_movements to authenticated;
grant all on public.stock_movements to service_role;
alter table public.stock_movements enable row level security;
create policy "Admins ven movimientos" on public.stock_movements for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.create_order(_items jsonb, _customer_name text, _customer_phone text default '', _notes text default '')
returns text language plpgsql security definer set search_path = public as $$
declare
  _order_id uuid; _code text; _total numeric := 0; _it jsonb; _p record; _v record;
  _qty int; _price numeric; _name text; _avail int;
begin
  if coalesce(trim(_customer_name), '') = '' then raise exception 'Indicá tu nombre para registrar el pedido.'; end if;
  if jsonb_typeof(_items) <> 'array' or jsonb_array_length(_items) = 0 then raise exception 'El carrito está vacío.'; end if;
  if jsonb_array_length(_items) > 50 then raise exception 'Demasiados productos en un pedido.'; end if;
  _code := 'H-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
  insert into public.orders (code, customer_name, customer_phone, notes)
    values (_code, left(trim(_customer_name), 120), left(coalesce(_customer_phone, ''), 40), left(coalesce(_notes, ''), 1000))
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
end; $$;
revoke all on function public.create_order(jsonb, text, text, text) from public;
grant execute on function public.create_order(jsonb, text, text, text) to anon, authenticated;

create or replace function public.set_order_status(_order_id uuid, _status text)
returns void language plpgsql security definer set search_path = public as $$
declare _o record; _i record;
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'No tenés permisos para esta acción.'; end if;
  if _status not in ('new','confirmed','delivered','cancelled') then raise exception 'Estado inválido.'; end if;
  select * into _o from public.orders where id = _order_id for update;
  if not found then raise exception 'Pedido no encontrado.'; end if;
  if _status in ('confirmed','delivered') and not _o.stock_applied then
    for _i in select * from public.order_items where order_id = _order_id loop
      if _i.variant_id is not null then
        update public.product_variants set stock = stock - _i.quantity where id = _i.variant_id;
      elsif _i.product_id is not null then
        update public.products set stock = stock - _i.quantity where id = _i.product_id;
      end if;
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
  update public.orders set status = _status where id = _order_id;
end; $$;
revoke all on function public.set_order_status(uuid, text) from public;
grant execute on function public.set_order_status(uuid, text) to authenticated;

create or replace function public.adjust_stock(_product_id uuid, _variant_id uuid, _delta int, _reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then raise exception 'No tenés permisos para esta acción.'; end if;
  if _variant_id is not null then
    update public.product_variants set stock = stock + _delta where id = _variant_id;
  else
    update public.products set stock = stock + _delta where id = _product_id;
  end if;
  insert into public.stock_movements (product_id, variant_id, delta, reason, created_by)
    values (_product_id, _variant_id, _delta, coalesce(nullif(trim(_reason), ''), 'ajuste manual'), auth.uid());
end; $$;
revoke all on function public.adjust_stock(uuid, uuid, int, text) from public;
grant execute on function public.adjust_stock(uuid, uuid, int, text) to authenticated;

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.news_posts to anon, authenticated;
grant insert, update, delete on public.news_posts to authenticated;
grant all on public.news_posts to service_role;
alter table public.news_posts enable row level security;
create policy "Novedades publicadas" on public.news_posts for select to anon, authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan novedades" on public.news_posts for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger news_updated before update on public.news_posts for each row execute function public.touch_updated_at();

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  label text not null,
  position numeric not null default 0,
  is_visible boolean not null default true,
  content jsonb not null default '{}'::jsonb
);
grant select on public.page_sections to anon, authenticated;
grant insert, update, delete on public.page_sections to authenticated;
grant all on public.page_sections to service_role;
alter table public.page_sections enable row level security;
create policy "Secciones visibles publicas" on public.page_sections for select to anon, authenticated
  using (is_visible or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan secciones" on public.page_sections for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Ajustes publicos" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins gestionan ajustes" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  description text not null default '',
  cover_url text,
  modality text not null default 'virtual',
  teacher text not null default '',
  starts_on date,
  ends_on date,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  position numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.workshops to anon, authenticated;
grant insert, update, delete on public.workshops to authenticated;
grant all on public.workshops to service_role;
alter table public.workshops enable row level security;
create policy "Talleres publicados" on public.workshops for select to anon, authenticated
  using (status = 'published' or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan talleres" on public.workshops for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger workshops_updated before update on public.workshops for each row execute function public.touch_updated_at();

create table public.workshop_enrollments (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'pending' check (status in ('pending','approved','revoked')),
  message text not null default '',
  created_at timestamptz not null default now(),
  unique (workshop_id, user_id)
);
grant select, insert, update, delete on public.workshop_enrollments to authenticated;
grant all on public.workshop_enrollments to service_role;
alter table public.workshop_enrollments enable row level security;
create policy "Ver inscripcion propia o admin" on public.workshop_enrollments for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Solicitar inscripcion" on public.workshop_enrollments for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending'
    and exists (select 1 from public.workshops w where w.id = workshop_id and w.status = 'published'));
create policy "Admins gestionan inscripciones" on public.workshop_enrollments for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins borran inscripciones" on public.workshop_enrollments for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create or replace function public.is_enrolled(_workshop_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.workshop_enrollments
    where workshop_id = _workshop_id and user_id = auth.uid() and status = 'approved')
$$;

create table public.workshop_lessons (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  title text not null,
  body text not null default '',
  video_url text,
  position numeric not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.workshop_lessons to authenticated;
grant all on public.workshop_lessons to service_role;
alter table public.workshop_lessons enable row level security;
create policy "Clases para inscriptos o admin" on public.workshop_lessons for select to authenticated
  using (public.is_enrolled(workshop_id) or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan clases" on public.workshop_lessons for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.workshop_materials (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  lesson_id uuid references public.workshop_lessons(id) on delete set null,
  title text not null,
  file_path text not null,
  file_name text not null,
  mime_type text not null default '',
  size_bytes bigint not null default 0,
  position numeric not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.workshop_materials to authenticated;
grant all on public.workshop_materials to service_role;
alter table public.workshop_materials enable row level security;
create policy "Materiales para inscriptos o admin" on public.workshop_materials for select to authenticated
  using (public.is_enrolled(workshop_id) or public.has_role(auth.uid(), 'admin'));
create policy "Admins gestionan materiales" on public.workshop_materials for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Seed: categories, products, images
insert into public.categories (name, slug, position) values ('Decoración','decoracion',1),('Papelería','papeleria',2);

with src(slug,name,description,price,cat,featured,pos,img) as (values
('perchero-doble','Perchero doble','Perchero doble confeccionado artesanalmente por los alumnos del taller Haruén. Una pieza práctica y decorativa con un toque único en sus detalles.',20000,'decoracion',true,1,'6a51c1b5-530d-4870-a604-5e71e3282ed9/perchero-doble-20000.webp'),
('espirales-cuadrados','Espirales Cuadrados','Móviles de vitrofusión con forma cuadrada y espirales de colores únicos. Cada pieza es creada a mano por los alumnos del taller Haruén, perfecta para alegrar cualquier ambiente.',30000,'decoracion',true,2,'de5585b6-8c2d-46aa-b507-4efa70cd567c/vitro4.webp'),
('espirales-caracol','Espirales Caracol','Delicados espirales de vidrio con forma de caracol, fundidos artesanalmente en el taller Haruén. Su diseño orgánico captura la luz de manera irrepetible.',30000,'decoracion',true,3,'36b63724-8e2c-4ea5-8c94-a091f4ee402c/vitro1.webp'),
('espiral-colgante','Espiral Colgante','Pieza colgante en espiral elaborada con técnica de vitrofusión por los alumnos de Haruén. Ideal para ventanas y espacios donde la luz realza sus colores.',25000,'decoracion',true,4,'5c71d308-a284-4d35-9c69-2c9e51955e65/vitro3.webp'),
('agenda-monitor-lisas','Agenda Tam. Monitor Hojas Lisas','Agenda elaborada y encuadernada a mano por nuestros alumnos. Tamaño monitor con hojas lisas, ideal para diseño o apuntes creativos.',6000,'papeleria',false,5,'f6c375f7-35c2-4df9-9339-a81bfc3688c3/agenda-tam-monitor-hojaslisas-6000.webp'),
('agenda-rivadavia-cuadriculada','Agenda Tam. Rivadavia Hoja Cuadriculada','Práctica agenda tamaño Rivadavia con hojas cuadriculadas. Cada ejemplar cuenta con detalles en su encuadernación realizados con mucho amor.',8000,'papeleria',false,6,'1c9363f8-034e-490d-9808-42cc4ea70af8/agenda-tam-rivadavia-hojacuadriculada-8000.webp'),
('anotadores-lisa','Anotadores Hoja Lisa','Anotadores prácticos con hojas lisas encuadernados de forma artesanal. Un producto solidario perfecto para regalar o llevar siempre con vos.',3000,'papeleria',false,7,'8e8bbf3d-5f66-4109-8333-2f1f597756f3/anotadores-hojalisa-3000.webp'),
('cuaderno-a4-rayadas','Cuaderno A4 Hojas Rayadas','Cuaderno clásico tamaño A4 con hojas rayadas. Su encuadernación de calidad es resultado del trabajo y aprendizaje constante de nuestros alumnos.',12000,'papeleria',false,8,'421d2b84-84f8-4eca-8ac5-6b02484dda6a/cuadernoa4-hojas-rayadas-12000.webp'),
('cuaderno-a4-zurdo','Cuaderno A4 para Zurdos Hojas Rayadas','Un cuaderno A4 con encuadernación especialmente diseñada de forma invertida para mayor comodidad de personas zurdas. Hojas rayadas.',12000,'papeleria',false,9,'c3e0cf29-00ea-416a-8fee-4331f567b199/cuadernoa4zurdo-hojas-rayadas12000.webp'),
('portavelas','Portavelas','Portavelas decorativos de vitrofusión, en pequeño formato. Cada uno es una pieza única hecha a mano por los alumnos del taller Haruén.',14000,'decoracion',false,10,'6c28dc51-2a63-42ad-bb53-34229af3af79/vitro2.webp'),
('plato-para-sushi','Plato para sushi','Plato alargado en vitrofusión, ideal para presentar sushi o como pieza decorativa de mesa. Creado artesanalmente por los alumnos de Haruén.',25000,'decoracion',false,11,'a4b3c6bb-df92-4279-b224-a5e147a3225f/plato-para-sushi.webp'),
('bandeja-13x29','Bandeja 13x29','Bandeja rectangular de vitrofusión de 13×29 cm, perfecta para organizar o decorar cualquier espacio. Pieza artesanal elaborada en el taller Haruén.',15000,'decoracion',false,12,'aa112d87-ccaa-4502-99f1-78d54db41421/bandeja-13x29.webp'),
('bandeja-23x31','Bandeja 23x31','Bandeja de vitrofusión de 23×31 cm con acabado artesanal único. Ideal para centro de mesa o como elemento decorativo de autor creado en Haruén.',20000,'decoracion',false,13,'0a5ccce5-331b-43b4-91df-e7651c20a7a3/bandeja-23x31.webp'),
('bandeja-19x36','Bandeja 19x36','Elegante bandeja alargada de vitrofusión de 19×36 cm, perfecta para servir o decorar. Cada pieza conserva el sello artesanal de los alumnos de Haruén.',22000,'decoracion',false,14,'ea14e8e6-b977-438b-974b-cf3af3a00c3a/bandeja-19x36.webp'),
('pinches-jardin','Pinches para jardín','Pinches decorativos para jardín con detalles en vitrofusión, que combinan originalidad y arte natural. Hechos a mano por los alumnos del taller Haruén.',20000,'decoracion',false,15,'8027bb30-98df-4217-8266-841f336996a4/percheros.webp'),
('fuente-circular-grande','Fuente circular grande','Imponente fuente circular de gran formato en vitrofusión, pieza central de cualquier mesa o ambiente. Obra artesanal de alto impacto creada en el taller Haruén.',98000,'decoracion',false,16,'eaeb9a42-721e-49ca-95fb-e166aa8dae15/fuenton-circular-grande.webp'),
('ceniceros','Ceniceros','Ceniceros artesanales en vitrofusión con diseños únicos e irrepetibles. Una pieza funcional y decorativa creada por los alumnos de Haruén.',15000,'decoracion',false,17,'02af7205-b3b4-40fe-a438-29eea1aa572e/ceniceros.webp'),
('centro-de-mesa-ovalado','Centro de mesa ovalado','Centro de mesa de forma ovalada en vitrofusión, ideal para dar un toque de color y elegancia artesanal. Pieza única elaborada en el taller Haruén.',50000,'decoracion',false,18,'3682dc9c-8ef3-4a26-8b05-7540f6e62dab/centro-de-mesa-ovalado.webp')
), ins as (
  insert into public.products (slug,name,description,price,category_id,featured,status,stock,position)
  select s.slug, s.name, s.description, s.price, c.id, s.featured, 'active', 5, s.pos
  from src s join public.categories c on c.slug = s.cat
  returning id, slug, name
)
insert into public.product_images (product_id, url, alt, position)
select ins.id, '/__l5e/assets-v1/' || src.img, ins.name, 1 from ins join src on src.slug = ins.slug;

insert into public.site_settings (key, value) values
('whatsapp_number', '"5493517680218"'::jsonb),
('campaign_status', '"iniciada"'::jsonb),
('campaign', '{"titulo":"Ayudanos a dejar Haruén hermosa","subtitulo":"Tu aporte, sin importar el monto, hace una gran diferencia. Con $1.000, $2.000 o lo que puedas sumar hoy, compramos pintura, rodillos y materiales para que nuestros 26 alumnos disfruten de un espacio seguro, alegre y renovado.","meta":10000000,"recaudado":1250000,"donantes":38,"sugerencias_impacto":[{"monto":1500,"descripcion":"Lijas y cinta de enmascarar"},{"monto":3500,"descripcion":"Pinceles y espátulas"},{"monto":7500,"descripcion":"Rodillo profesional y bandeja"},{"monto":15000,"descripcion":"1 litro de látex lavable especial"}]}'::jsonb),
('bank', '{"alias":"AMOR.TIPO.DESEO","cbu":"0200923401000003535214","banco":"Bco Córdoba (Bancor)","cuit":"30-70335352-1","titular":"FUNDACION HARUEN"}'::jsonb);

insert into public.page_sections (type, label, position, is_visible, content) values
('hero','Inicio',1,true,'{}'),
('campaign','Campaña de donación',2,true,'{}'),
('about','Nosotros',3,true,'{}'),
('impact','Impacto',4,true,'{}'),
('info','Información',5,true,'{}'),
('store','Tienda',6,true,'{}'),
('news','Últimas novedades',7,true,'{"title":"Novedades","subtitle":"Lo que está pasando en la Comunidad Haruén."}'),
('workshops','Talleres virtuales',8,true,'{"title":"Talleres virtuales","subtitle":"Aprendé con nosotros desde casa."}'),
('donate','Donaciones',9,true,'{}'),
('contact','Contacto',10,true,'{}');
create policy "Admins suben media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins editan media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins borran media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins leen media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "Admins suben materiales" on storage.objects for insert to authenticated
  with check (bucket_id = 'workshop-materials' and public.has_role(auth.uid(), 'admin'));
create policy "Admins editan materiales" on storage.objects for update to authenticated
  using (bucket_id = 'workshop-materials' and public.has_role(auth.uid(), 'admin'));
create policy "Admins borran materiales" on storage.objects for delete to authenticated
  using (bucket_id = 'workshop-materials' and public.has_role(auth.uid(), 'admin'));
create policy "Inscriptos o admins leen materiales" on storage.objects for select to authenticated
  using (bucket_id = 'workshop-materials' and (
    public.has_role(auth.uid(), 'admin')
    or public.is_enrolled(((storage.foldername(name))[1])::uuid)
  ));
import { redirect } from 'next/navigation';

// Executive role is now served by the admin dashboard in read-only mode.
export default function ExecutivePage() {
  redirect('/admin');
}

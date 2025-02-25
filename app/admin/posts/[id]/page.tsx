import { Metadata } from 'next';
import EditPostClient from './EditPostClient';

export default function EditPostPage(props: any) {
  return <EditPostClient {...props} />;
}

export const metadata: Metadata = {
  title: 'Edit Post',
  description: 'Edit your blog post',
}; 
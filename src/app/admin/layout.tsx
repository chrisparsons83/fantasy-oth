import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid md:grid-cols-12 md:gap-4'>
      <div className='bg-slate-300 md:col-span-3'>Hello</div>
      <div className='bg-slate-300 md:col-span-9'>{children}</div>
    </div>
  );
};

export default AdminLayout;

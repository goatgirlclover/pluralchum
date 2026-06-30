import PKPencil from './pkPencil.svg';
import PKTrash from './pkTrash.svg';
import React from '@moonlight-mod/wp/react';

export function PKEditIcon() {
  return (
    <div className='iconContainer_c1e9c4'>
      <PKPencil className='icon_c1e9c4'></PKPencil>
    </div>
  );
}

export function PKEditIconPopover() {
  return <PKPencil className='icon_f84418'></PKPencil>;
}

export function PKTrashIcon() {
  return (
    <div className='iconContainer_c1e9c4'>
      <PKTrash className='icon_c1e9c4'></PKTrash>
    </div>
  );
}

export function PKTrashIconPopover() {
  return <PKTrash className='icon_f84418'></PKTrash>;
}

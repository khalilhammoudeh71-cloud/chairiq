import React from 'react';
import { Trash2, GripVertical, Camera } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProcedureThumb from '../../../components/ProcedureThumb';

export default function ProcedureTableRow({ 
  procedure, 
  index, 
  onDelete,
  isDragging = false,
  isEven = false 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id: procedure?.id || `procedure-${index}` });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-danger/10 text-danger border-danger';
      case 'Soon':
        return 'bg-warning/10 text-warning border-warning';
      case 'Later':
        return 'bg-success/10 text-success border-success';
      default:
        return 'bg-bg2 text-t1 border-bd';
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text?.length > maxLength ? `${text?.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      {/* Desktop Table Row */}
      <tr 
        ref={setNodeRef} 
        style={style}
        className={`hidden md:table-row hover:bg-bg2 transition-colors border-b border-bd ${isEven ? 'bg-bg2/50' : 'bg-bg1'}`}
      >
        {/* Drag Handle */}
        <td className="px-4 py-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-t3 hover:text-t1 p-1"
          >
            <GripVertical size={20} />
          </button>
        </td>

        {/* Priority */}
        <td className="px-4 py-4">
          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border tracking-wide ${getPriorityColor(procedure?.priority)}`}>
            {procedure?.priority || 'Soon'}
          </span>
        </td>

        {/* Tooth Numbers */}
        <td className="px-4 py-4">
          <span className="text-t1 font-medium">
            {procedure?.toothNumbers || '-'}
          </span>
        </td>

        {/* Treatment Title */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-2.5 group">
            <ProcedureThumb
              canonicalSlug={procedure?.canonicalSlug}
              slug={procedure?.slug}
              name={procedure?.displayTitle || procedure?.procedureName}
              size="sm"
              className="!w-12 !h-8"
            />
            <span className="text-t1 font-medium">
              {procedure?.displayTitle || procedure?.procedureName || '-'}
            </span>
            {procedure?.patientImages?.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                <Camera size={12} />
                {procedure.patientImages.length}
              </span>
            )}
          </div>
        </td>

        {/* ADA Code */}
        <td className="px-4 py-4">
          <span className="text-accent font-mono">
            {procedure?.adaCode || '-'}
          </span>
        </td>

        {/* Est. Time */}
        <td className="px-4 py-4">
          <span className="text-t3">
            {procedure?.estTime || '-'}
          </span>
        </td>

        {/* Notes Preview */}
        <td className="px-4 py-4 max-w-xs">
          <span className="text-t3 text-sm">
            {truncateText(procedure?.notesForPatient)}
          </span>
        </td>

        {/* Delete */}
        <td className="px-4 py-4">
          <button
            onClick={() => onDelete(index)}
            className="p-2 text-danger hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </tr>

      {/* Mobile Card Layout */}
      <div 
        ref={setNodeRef}
        style={style}
        className="md:hidden mb-4 bg-bg2 rounded-xl border-2 border-accent/30 overflow-hidden"
      >
        {/* Card Header with Drag Handle */}
        <div className="flex items-center gap-3 p-4 bg-bg3 border-b border-bd">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-t3 hover:text-t1 p-1"
          >
            <GripVertical size={20} />
          </button>
          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border tracking-wide ${getPriorityColor(procedure?.priority)}`}>
            {procedure?.priority || 'Soon'}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => onDelete(index)}
            className="p-2 text-danger hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-t3">Treatment Title</p>
              {procedure?.patientImages?.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                  <Camera size={12} />
                  {procedure.patientImages.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <ProcedureThumb
                canonicalSlug={procedure?.canonicalSlug}
                slug={procedure?.slug}
                name={procedure?.displayTitle || procedure?.procedureName}
                size="sm"
                className="!w-12 !h-8"
              />
              <p className="text-t1 font-semibold mb-0">
                {procedure?.displayTitle || procedure?.procedureName || '-'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-t3 mb-1">Tooth #</p>
              <p className="text-t1 font-medium">
                {procedure?.toothNumbers || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-t3 mb-1">ADA Code</p>
              <p className="text-accent font-mono">
                {procedure?.adaCode || '-'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-t3 mb-1">Est. Time</p>
            <p className="text-t3">
              {procedure?.estTime || '-'}
            </p>
          </div>

          {procedure?.notesForPatient && (
            <div>
              <p className="text-xs text-t3 mb-1">Notes</p>
              <p className="text-t3 text-sm">
                {procedure?.notesForPatient}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
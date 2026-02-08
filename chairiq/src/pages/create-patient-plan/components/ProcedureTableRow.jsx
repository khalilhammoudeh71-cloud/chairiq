import React from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ProcedureTableRow({ 
  procedure, 
  index, 
  onDelete,
  isDragging = false 
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
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Later':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
        className="hidden md:table-row hover:bg-slate-700/50 transition-colors border-b border-slate-600"
      >
        {/* Drag Handle */}
        <td className="px-4 py-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white p-1"
          >
            <GripVertical size={20} />
          </button>
        </td>

        {/* Priority */}
        <td className="px-4 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(procedure?.priority)}`}>
            {procedure?.priority || 'Soon'}
          </span>
        </td>

        {/* Tooth Numbers */}
        <td className="px-4 py-4">
          <span className="text-white font-medium">
            {procedure?.toothNumbers || '-'}
          </span>
        </td>

        {/* Treatment Title */}
        <td className="px-4 py-4">
          <span className="text-white font-medium">
            {procedure?.displayTitle || procedure?.procedureName || '-'}
          </span>
        </td>

        {/* ADA Code */}
        <td className="px-4 py-4">
          <span className="text-blue-300 font-mono">
            {procedure?.adaCode || '-'}
          </span>
        </td>

        {/* Est. Time */}
        <td className="px-4 py-4">
          <span className="text-gray-300">
            {procedure?.estTime || '-'}
          </span>
        </td>

        {/* Notes Preview */}
        <td className="px-4 py-4 max-w-xs">
          <span className="text-gray-400 text-sm">
            {truncateText(procedure?.notesForPatient)}
          </span>
        </td>

        {/* Delete */}
        <td className="px-4 py-4">
          <button
            onClick={() => onDelete(index)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </td>
      </tr>

      {/* Mobile Card Layout */}
      <div 
        ref={setNodeRef}
        style={style}
        className="md:hidden mb-4 bg-slate-700/80 rounded-xl border-2 border-blue-500/30 overflow-hidden"
      >
        {/* Card Header with Drag Handle */}
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 border-b border-slate-600">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white p-1"
          >
            <GripVertical size={20} />
          </button>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(procedure?.priority)}`}>
            {procedure?.priority || 'Soon'}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => onDelete(index)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-blue-200 mb-1">Treatment Title</p>
            <p className="text-white font-semibold">
              {procedure?.displayTitle || procedure?.procedureName || '-'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-blue-200 mb-1">Tooth #</p>
              <p className="text-white font-medium">
                {procedure?.toothNumbers || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-200 mb-1">ADA Code</p>
              <p className="text-blue-300 font-mono">
                {procedure?.adaCode || '-'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-blue-200 mb-1">Est. Time</p>
            <p className="text-gray-300">
              {procedure?.estTime || '-'}
            </p>
          </div>

          {procedure?.notesForPatient && (
            <div>
              <p className="text-xs text-blue-200 mb-1">Notes</p>
              <p className="text-gray-400 text-sm">
                {procedure?.notesForPatient}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
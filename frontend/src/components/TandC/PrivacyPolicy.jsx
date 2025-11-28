import React from 'react';
import { Edit, Save, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const PrivacyPolicy = ({
  policy,
  editMode,
  onEdit,
  onCancel,
  onSave,
  isSaving,
  saveStatus,
  onAddPoint,
  onEditPoint,
  onSaveEditedPoint,
  onDeletePoint,
  onMovePoint,
  newPoint,
  setNewPoint,
  editingPoint,
  setEditingPoint
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Policy Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{policy.title}</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Last updated: {policy.lastUpdated}
          </p>
        </div>
        {!editMode && (
          <button
            onClick={onEdit}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </button>
        )}
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-3 rounded-lg text-sm sm:text-base ${saveStatus.includes('success')
          ? 'bg-green-100 text-green-700'
          : 'bg-blue-100 text-blue-700'
          }`}>
          {saveStatus}
        </div>
      )}

      {/* Policy Content */}
      {editMode ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Add New Point */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Add New Point</h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Point Title</label>
                <input
                  type="text"
                  value={newPoint.title}
                  onChange={(e) => setNewPoint({ ...newPoint, title: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter point title"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPoint.description}
                  onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
                  className="w-full h-20 sm:h-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter point description"
                />
              </div>
              <button
                onClick={onAddPoint}
                className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                <Plus size={16} className="mr-1" />
                Add Point
              </button>
            </div>
          </div>

          {/* Policy Points */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Policy Points</h3>
            {policy.points.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No points added yet.</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {policy.points.map((point, index) => (
                  <div key={point.point_id} className="border rounded-lg p-3 sm:p-4 bg-white">
                    {editingPoint && editingPoint.point_id === point.point_id ? (
                      <div className="mb-4">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Point Title</label>
                          <input
                            type="text"
                            value={editingPoint.point_title}
                            onChange={(e) => setEditingPoint({ ...editingPoint, point_title: e.target.value })}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editingPoint.point_description}
                            onChange={(e) => setEditingPoint({ ...editingPoint, point_description: e.target.value })}
                            className="w-full h-20 sm:h-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={onSaveEditedPoint}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPoint(null)}
                            className="px-3 py-1 text-gray-700 border rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
                          <h4 className="text-base sm:text-lg font-medium text-gray-800">
                            {index + 1}. {point.point_title}
                          </h4>
                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() => onMovePoint(point.point_id, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                              title="Move up"
                            >
                              <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => onMovePoint(point.point_id, 'down')}
                              disabled={index === policy.points.length - 1}
                              className={`p-1 rounded ${index === policy.points.length - 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                              title="Move down"
                            >
                              <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => onEditPoint(point)}
                              className="p-1 text-blue-600 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => onDeletePoint(point.point_id)}
                              className="p-1 text-red-600 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{point.point_description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            {policy.points.map((point, index) => (
              <div key={point.point_id} className="mb-4 sm:mb-6 last:mb-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {index + 1}. {point.point_title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{point.point_description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicy;

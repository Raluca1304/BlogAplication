import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    type: 'edit' | 'delete' | 'view';
    children: React.ReactNode;
    disabled?: boolean;
}

export function ActionButton({ onClick, type, children, disabled = false }: ActionButtonProps) {
    const getButtonStyle = () => {
        const baseStyle = {
            padding: '6px 12px',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            fontSize: '14px',
            fontWeight: '500'
        };

        switch (type) {
            case 'edit':
                return {
                    ...baseStyle,
                    backgroundColor: disabled ? '#ccc' : '#007bff',
                    marginRight: '8px'
                };
            case 'delete':
                return {
                    ...baseStyle,
                    backgroundColor: disabled ? '#ccc' : '#dc3545',
                    marginRight: '8px'
                };
            case 'view':
                return {
                    ...baseStyle,
                    backgroundColor: disabled ? '#ccc' : '#6c757d'
                };
            default:
                return baseStyle;
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={getButtonStyle()}
        >
            {children}
        </button>
    );
}

interface ActionButtonGroupProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
    showEdit?: boolean;
    showDelete?: boolean;
    showView?: boolean;
}

export function ActionButtonGroup({ 
    onEdit, 
    onDelete, 
    onView, 
    showEdit = true, 
    showDelete = true, 
    showView = true 
}: ActionButtonGroupProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {showEdit && onEdit && (
                <ActionButton onClick={onEdit} type="edit">
                    Edit
                </ActionButton>
            )}
            {showDelete && onDelete && (
                <ActionButton onClick={onDelete} type="delete">
                    Delete
                </ActionButton>
            )}
            {showView && onView && (
                <ActionButton onClick={onView} type="view">
                    View
                </ActionButton>
            )}
        </div>
    );
}
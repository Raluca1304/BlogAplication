// Used for admin actions, i.e. edit, delete, view, for users, articles, comments
import React from 'react';
import { ActionButtonProps, ActionButtonGroupProps } from '../../../types';
import { Button } from '@/components/ui/button';

// children is the content of the button, i.e. Edit, Delete, View
// disabled is a boolean that determines if the button is disabled(false - for active button, true - for disabled button)
export function ActionButton({ onClick, type, children, disabled = false }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
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
        <div className="flex gap-2">
            {showEdit && onEdit && (
                <Button onClick={onEdit} variant="navy">
                    Edit
                </Button>
            )}
            {showDelete && onDelete && (
                <Button onClick={onDelete} variant="redDark">
                    Delete
                </Button>
            )}
            {showView && onView && (
                <Button onClick={onView} variant="beige">
                    View
                </Button>
            )}
        </div>
    );
}
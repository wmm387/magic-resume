import { Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react'
import { Reorder } from 'framer-motion'
import IconSelector from '../IconSelector'
import Field from '../Field'
import type { CustomFieldType } from '@/types/resume'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

interface CustomFieldProps {
  field: CustomFieldType;
  onUpdate: (field: CustomFieldType) => void;
  onDelete: (id: string) => void;
}

export default function CustomField({ field, onUpdate, onDelete, }: CustomFieldProps) {

  return (
    <Reorder.Item
      value={field}
      id={field.id}
      className="group touch-none list-none"
    >
      <div
        className={cn(
          'items-center p-3 space-y-2',
          'bg-card rounded-xl',
          'border border-border',
          'transition-all duration-200',
          'hover:border-primary/20',
          !field.visible && '!opacity-60'
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-center">
            <GripVertical
              className={cn(
                'w-4 h-4 cursor-grab active:cursor-grabbing',
                'text-muted-foreground',
                'transition-colors duration-200',
                'group-hover:text-foreground'
              )}
            />
            <IconSelector
              value={field.icon}
              onChange={(value) => onUpdate({ ...field, icon: value })}
            />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={field.displayLabel ?? false}
                onCheckedChange={checked => onUpdate({ ...field, displayLabel: checked, })}
              />
              <span className="text-xs text-muted-foreground">
                显示标签
              </span>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => onUpdate({ ...field, visible: !field.visible })}
              >
                {field.visible ? (<Eye className="w-4 h-4 text-primary" />) : (<EyeOff className="w-4 h-4" />)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(field.id)}
                className="shrink-0 h-8 px-2 text-neutral-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 items-center justify-center">
          <div className="col-span-2">
            <Field
              value={field.label ?? ''}
              onChange={value => onUpdate({ ...field, label: value })}
              aria-label={field.label}
              placeholder="标签"
              className="bg-background/50 border-border focus:border-primary placeholder-muted-foreground"
            />
          </div>
          <div className="col-span-3">
            <Field
              value={field.value}
              onChange={value => onUpdate({ ...field, value: value })}
              aria-label={field.label}
              placeholder="值"
              className="bg-background/50 border-border focus:border-primary placeholder-muted-foreground"
            />
          </div>
        </div>
      </div>
    </Reorder.Item>
  )
}

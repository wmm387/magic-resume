import React, { useState } from 'react'
import { Eye, EyeOff, GripVertical, PlusCircle, Trash2 } from 'lucide-react'
import { AnimatePresence, Reorder, motion } from 'framer-motion'
import IconSelector from '../IconSelector'
import Field from '../Field'
import AlignSelector from './AlignSelector'
import type { BasicFieldType, CustomFieldType } from '@/types/resume'
import { useTranslations } from '@/i18n/compat/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import PhotoSelector from '@/components/shared/PhotoSelector'
import { cn } from '@/lib/utils'
import { DEFAULT_FIELD_ORDER } from '@/config'
import { useResumeStore } from '@/store/useResumeStore'



const itemAnimations = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
  transition: { type: 'spring', stiffness: 500, damping: 50, mass: 1 },
}



const BasicField: React.FC<BasicFieldType> = (field: BasicFieldType) => {
  const { activeResume, updateBasicInfo } = useResumeStore()
  const { basic } = activeResume || {}

  const [basicFields, setBasicFields] = useState<BasicFieldType[]>(() => {
    if (!basic?.fieldOrder) {
      return DEFAULT_FIELD_ORDER
    }
    return basic.fieldOrder.map((field) => ({
      ...field,
      visible: field.visible ?? true,
    }))
  })

  const t = useTranslations('workbench.basicPanel')

  const selectedIcon = basic?.icons?.[field.key] || 'User'


  const toggleFieldVisibility = (fieldId: string, isVisible: boolean) => {
    const newFields = basicFields.map((field) =>
      field.id === fieldId ? { ...field, visible: isVisible } : field
    )
    setBasicFields(newFields)
    updateBasicInfo({
      ...basic,
      fieldOrder: newFields,
    })
  }

  const deleteBasicField = (fieldId: string) => {
    const fieldToDelete = basicFields.find((field) => field.id === fieldId)
    if (
      fieldToDelete &&
      (fieldToDelete.key === 'name' || fieldToDelete.key === 'title')
    ) {
      return
    }

    const updatedFields = basicFields.filter((field) => field.id !== fieldId)
    setBasicFields(updatedFields)
    updateBasicInfo({
      ...basic,
      fieldOrder: updatedFields,
    })
  }

  return (
    <Reorder.Item
      value={field}
      id={field.id}
      key={field.id}
      className="group touch-none list-none"
      dragListener={field.key !== 'name' && field.key !== 'title'}
    >
      <motion.div
        {...itemAnimations}
        className={cn(
          'flex items-center gap-4 p-4 pr-3',
          'bg-card',
          'rounded-lg ',
          'transition-all duration-200',
          !field.visible && 'opacity-75'
        )}
      >
        {field.key !== 'name' && field.key !== 'title' && (
          <div className="shrink-0">
            <GripVertical
              className={cn(
                'w-5 h-5 cursor-grab active:cursor-grabbing',
                'text-muted-foreground',
                'hover:text-foreground',
                'transition-colors duration-200'
              )}
            />
          </div>
        )}

        <div className="flex flex-1 min-w-0 items-center">
          {field.key !== 'name' && field.key !== 'title' && (
            <IconSelector
              value={selectedIcon}
              onChange={(value) => {
                updateBasicInfo({
                  ...basic,
                  icons: {
                    ...(basic?.icons || {}),
                    [field.key]: value,
                  },
                })
              }}
            />
          )}
          <div className=" w-[70px] ml-[4px] text-sm font-medium text-foreground">
            {t(`basicFields.${field.key}`)}
          </div>
          <div className="flex-1">
            <Field
              label=""
              value={(basic?.[field.key] as string) ?? ''}
              onChange={(value) =>
                updateBasicInfo({
                  ...basic,
                  [field.key]: value,
                })
              }
              placeholder={`请输入${field.label}`}
              type={field.type}
              aria-label={field.label}
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'shrink-0 h-8 px-2',
              'text-neutral-500 dark:text-neutral-400',
              'hover:text-neutral-700 dark:hover:text-neutral-200'
            )}
            onClick={() => toggleFieldVisibility(field.id, !field.visible)}
          >
            {field.visible ? (
              <Eye className="w-4 h-4 text-primary" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>

          {field.key !== 'name' && field.key !== 'title' && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'shrink-0 h-8 px-2',
                'text-neutral-500 dark:text-neutral-400',
                'hover:text-red-600 dark:hover:text-red-400'
              )}
              onClick={() => deleteBasicField(field.id)}
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          )}
        </div>
      </motion.div>
    </Reorder.Item>
  )
}

export default BasicField

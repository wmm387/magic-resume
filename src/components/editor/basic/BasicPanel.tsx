import React, { useState } from 'react'
import { Eye, EyeOff, GripVertical, PlusCircle, Trash2 } from 'lucide-react'
import { AnimatePresence, Reorder, motion } from 'framer-motion'
import IconSelector from '../IconSelector'
import Field from '../Field'
import AlignSelector from './AlignSelector'
import CustomField from './CustomField'
import type { BasicFieldType, CustomFieldType } from '@/types/resume'
import { useTranslations } from '@/i18n/compat/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import PhotoSelector from '@/components/shared/PhotoSelector'
import { cn } from '@/lib/utils'
import { DEFAULT_FIELD_ORDER } from '@/config'
import { useResumeStore } from '@/store/useResumeStore'
import { generateUUID } from '@/utils/uuid'

const itemAnimations = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
  transition: { type: 'spring', stiffness: 500, damping: 50, mass: 1 },
}

const BasicPanel: React.FC = () => {
  const { activeResume, updateBasicInfo } = useResumeStore()
  const { basic } = activeResume || {}
  const [customFields, setCustomFields] = useState<CustomFieldType[]>(
    basic?.customFields?.map((field) => ({
      ...field,
      visible: field.visible ?? true,
    })) || []
  )
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

  const handleBasicReorder = (newOrder: BasicFieldType[]) => {
    setBasicFields(newOrder)
    updateBasicInfo({
      ...basic,
      fieldOrder: newOrder,
    })
  }

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

  const addCustomField = () => {
    const fieldToAdd: CustomFieldType = {
      id: generateUUID(),
      label: '',
      value: '',
      icon: 'User',
      visible: true,
      displayLabel: false,
    }
    const updatedFields = [...customFields, fieldToAdd]
    setCustomFields(updatedFields)
    updateBasicInfo({
      ...basic,
      customFields: updatedFields,
    })
  }

  const updateCustomField = (updatedField: CustomFieldType) => {
    const updatedFields = customFields.map(field =>
      field.id === updatedField.id ? updatedField : field
    )
    setCustomFields(updatedFields)
    updateBasicInfo({ ...basic, customFields: updatedFields })
  }

  const deleteCustomField = (id: string) => {
    const updatedFields = customFields.filter((field) => field.id !== id)
    setCustomFields(updatedFields)
    updateBasicInfo({
      ...basic,
      customFields: updatedFields,
    })
  }

  const handleCustomFieldsReorder = (newOrder: CustomFieldType[]) => {
    setCustomFields(newOrder)
    updateBasicInfo({
      ...basic,
      customFields: newOrder,
    })
  }

  const renderBasicField = (field: BasicFieldType) => {
    const selectedIcon = basic?.icons?.[field.key] || 'User'

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
          className={cn('flex items-center gap-2 p-3', 'transition-all duration-200', !field.visible && 'opacity-75')}
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
            <div className=" w-[50px] ml-[4px] text-sm font-medium text-foreground">
              {t(`basicFields.${field.key}`)}
            </div>
            <div className="flex-1">
              <Field
                label=""
                value={(basic?.[field.key] as string) ?? ''}
                onChange={(value) => updateBasicInfo({ ...basic, [field.key]: value })}
                placeholder={`请输入${field.label}`}
                type={field.type}
                aria-label={field.label}
              />
            </div>
          </div>

          <div className="flex items-center gap-0">
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">{t('layout')}</h2>
        <div className=" bg-card rounded-lg">
          <AlignSelector
            value={basic?.layout || 'left'}
            onChange={(value) => updateBasicInfo({ ...basic, layout: value, })}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{t('title')}</h2>
        </div>
        <motion.div className="space-y-6">
          {/* 头像 */}
          <div className="bg-card rounded-xl p-3 border border-border">
            <PhotoSelector />
          </div>
          <motion.div className="space-y-6">
            {/* 基础字段 */}
            <div className="space-y-3">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-200 px-1">
                {t('basicField')}
              </h3>
              <AnimatePresence mode="popLayout">
                <Reorder.Group
                  axis="y"
                  as="div"
                  values={basicFields}
                  onReorder={handleBasicReorder}
                  className="space-y-3"
                >
                  {basicFields.map((field) => renderBasicField(field))}
                </Reorder.Group>
              </AnimatePresence>
            </div>
            {/* 自定义字段 */}
            <motion.div className="space-y-3">
              <motion.h3 className="font-medium text-neutral-900 dark:text-neutral-200 px-1">
                {t('customField')}
              </motion.h3>
              <AnimatePresence mode="popLayout">
                <Reorder.Group
                  axis="y"
                  as="div"
                  values={customFields}
                  onReorder={handleCustomFieldsReorder}
                  className="space-y-3"
                >
                  {Array.isArray(customFields) &&
                    customFields.map((field) => (
                      <CustomField
                        key={field.id}
                        field={field}
                        onUpdate={updateCustomField}
                        onDelete={deleteCustomField}
                      />
                    ))}
                </Reorder.Group>
              </AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button onClick={addCustomField} className="w-full mt-4">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t('customFields.addButton')}
                </Button>
              </motion.div>
            </motion.div>
            {/* github贡献 */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-200 px-1">
                  {t('githubContributions')}
                </h3>
                <Switch
                  checked={basic?.githubContributionsVisible}
                  onCheckedChange={(checked) =>
                    updateBasicInfo({
                      ...basic,
                      githubContributionsVisible: checked,
                    })
                  }
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center ml-3 space-x-2">
                  <div className=" w-[110px]">Access Token</div>
                  <Input
                    placeholder="请输入github access token"
                    className="flex-1"
                    value={basic?.githubKey}
                    onChange={e => updateBasicInfo({ ...basic, githubKey: e.target.value, })}
                  />
                </div>
                <div className="flex items-center ml-3 mt-4 space-x-2">
                  <div className="w-[110px]">UseName</div>
                  <Input
                    className="flex-1"
                    placeholder="请输入github username"
                    value={basic?.githubUseName}
                    onChange={e => updateBasicInfo({ ...basic, githubUseName: e.target.value, })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default BasicPanel

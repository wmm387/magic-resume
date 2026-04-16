import Field from '../Field'
import { useResumeStore } from '@/store/useResumeStore'

const SelfEvaluationPanel = () => {
    const { activeResume, updateSelfEvaluationContent } = useResumeStore()
    const selfEvaluationContent = activeResume?.selfEvaluationContent ?? ''
    const handleChange = (value: string) => {
        updateSelfEvaluationContent(value)
    }

    return (
        <div className="rounded-lg border p-4 bg-card border-border">
            <Field
                value={selfEvaluationContent}
                onChange={handleChange}
                type="editor"
                placeholder="描述你的自我评价..."
            />
        </div>
    )
}

export default SelfEvaluationPanel

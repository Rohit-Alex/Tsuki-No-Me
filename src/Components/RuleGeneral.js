import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useFormContext } from '../Context/FormContext'
import { Card, Input } from 'antd'


const RuleGeneral = () => {
    const { setFormData, setFormValidity, formState } = useFormContext()
    const { data: formData } = formState


    // const [currencyOptions] = useState(
    //     Object.entries(CURRENCY.options).map(([, value]) =>
    //         constructOption(value, t(value))
    //     )
    // )

    const handleDateTimeChange = ({ startDate, endDate, errors }) => {
        setFormData('startDate', startDate)
        setFormData('endDate', endDate)

        errors.forEach(({ key, hasError, message }) => {
            setFormValidity(key, !hasError, { ...(hasError && { message }) })
        })
    }

    return (
        <div type="modal">
            <div>
                <h3>{('RULE_SECTION_GENERAL')}</h3>
            </div>
            <div>
                <div data-testid="ruledetails-general" className="ruledetails-general">
                    <div>
                        <div>
                            <Input
                                label={'CREATE_RULE_FIELD_NAME'}
                                placeholder={('CREATE_RULE_FIELD_NAME_PLACEHOLDER')}
                                onChange={({ target }) => {
                                    setFormData('name', target.value)
                                }}
                                value={get(formData, 'name', '')}
                                // disabled={!!isEditable}
                            />
                            {/* <Hint isIcon={false}>{t('CREATE_RULE_FIELD_NAME_HINT')}</Hint> */}
                        </div>
                        <div>
                            <Input
                                label={('CREATE_RULE_FIELD_DESCRIPTION')}
                                placeholder={('CREATE_RULE_FIELD_DESCRIPTION_PLACEHOLDER')}
                                onChange={({ target }) => {
                                    setFormData('DESCRIPTION', target.value)
                                }}
                                value={get(formData, 'DESCRIPTION', '')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RuleGeneral
import React from 'react'
import { Form, Message } from 'semantic-ui-react'

const FormSuccess = ({responsestatusText,detail}) => (
  <Form success>
    <Message
      success
      header={responsestatusText}
      content={detail}
    />
  </Form>
)

export default FormSuccess
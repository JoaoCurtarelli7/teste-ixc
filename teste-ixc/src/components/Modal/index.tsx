import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  message,
} from 'antd'
import { Transaction } from '../../pages/Transactions'
import moment from 'moment'

interface AddTransactionModalProps {
  visible: boolean
  onClose: () => void
  onAddTransaction: (transaction: Transaction) => void
}

interface TransactionFormValues {
  description: string
  amount: number
  date: moment.Moment
}

export default function AddTransactionModal({
  visible,
  onClose,
  onAddTransaction,
}: AddTransactionModalProps) {
  const [form] = Form.useForm()

  const handleFinish = (values: TransactionFormValues) => {
    const { description, amount, date } = values
    console.log(values)

    const newTransaction: Transaction = {
      key: Date.now().toString(),
      description,
      amount,
      date: date.format('DD/MM/YYYY'),
      type: amount >= 0 ? 'income' : 'expense',
    }

    onAddTransaction(newTransaction)

    form.resetFields()

    onClose()

    message.success('Transação adicionada com sucesso!')
  }

  return (
    <Modal
      title="Adicionar Transação"
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            { required: true, message: 'Por favor, insira a descrição!' },
          ]}
        >
          <Input placeholder="Descrição da transação" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Valor"
          rules={[
            { required: true, message: 'Por favor, insira o valor!' },
            { type: 'number', message: 'O valor deve ser um número!' },
            {
              validator: (_, value) =>
                value !== 0
                  ? Promise.resolve()
                  : // eslint-disable-next-line prefer-promise-reject-errors
                    Promise.reject('O valor não pode ser zero!'),
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Valor da transação"
            min={Number.MIN_SAFE_INTEGER}
            max={Number.MAX_SAFE_INTEGER}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Data"
          rules={[{ required: true, message: 'Por favor, selecione a data!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Data da transação"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Adicionar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

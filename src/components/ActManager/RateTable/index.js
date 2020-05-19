import React, { Component, useContext, useState, useEffect, useRef } from 'react'
import './index.css'
import axios from 'axios'
import config from '../../config'
import qs from 'qs'

import { Table, Input, Button, Popconfirm, Form, Alert } from 'antd'

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    let message = {
      message: '提交'
    }
    if (record.rated) {
      message = {
        message: '确认修改'
      }
    }
    const able = {
      state: false
    }
    const disabled = {
      state: true
    }
    try {
      const values = await form.validateFields();
      console.log(values)
      console.log(record)
      toggleEdit();
      if (values.performance === '' || record.performance === '') {
        handleSave({ ...record, ...values, ...disabled, ...message });
      }
      if (values.performance !== '' || record.performance !== '') {
        handleSave({ ...record, ...values, ...able, ...message });
      } else {
        handleSave({ ...record, ...values, ...message });
      }

    } catch (errInfo) {
      console.log('Save failed:', errInfo);
      handleSave({ ...record, ...disabled, ...message });
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

class RateTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        width: '15%'
      },
      {
        title: '学号',
        dataIndex: 'number',
        width: '18%'
      },
      {
        title: '表现',
        dataIndex: 'performance',
        editable: true,
        width: '30%'
      },
      {
        title: '得分',
        dataIndex: 'score',
        editable: true,
        width: '15%'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1
            ? (
              <Button
                onClick={() => this.handleDelete(record)}
                disabled={record.state}>{record.message}</Button>
            )
            : null,
      },
    ];
    this.state = {
      dataSource: [
        {
          key: '0',
          name: '你大爷',
          number: 'A19160001',
          performance: 'London, Park Lane no. 0',
          score: 9,
          state: false
        },
        {
          key: '1',
          name: '你大爷的',
          number: 'A19160001',
          performance: 'London, Park Lane no. 0',
          score: 4,
          state: false
        },
        {
          key: '2',
          name: '你大爷的',
          number: 'A19160001',
          performance: '',
          score: 0,
          state: true
        }
      ],
      count: 2,
      message: {
        info: '添加或修改成绩',
        type: 'success',
        disable: false
      }
    };
  }

  handleDelete = (info) => {
    if (info.rated) {
      console.log('rated')
      axios.put(config.url.putScore, qs.stringify({
        scoreId: info._id,
        performance: info.performance,
        score: info.score
      }))
        .then(res => {
        console.log(res.data)
          const update = {
            state: true,
            message: '修改成功'
          }
          this.handleSave({ ...info, ...update })
        }).catch(err => {
        console.log(err)
      })
    } else {
      axios.post(config.url.postScore, qs.stringify({
        studentNumber: info.number,
        activityId: this.props.activityId,
        studentId: info.key,
        performance: info.performance,
        score: info.score
      }))
        .then(res => {
          console.log(res.data.scoreId)
          const update = {
            _id: res.data.scoreId,
            state: true,
            rated: true,
            message: '提交成功'
          }
          this.handleSave({ ...info, ...update })
        })
        .catch(err => {
          console.log(err)
          if (err.scoreId) {
            console.log(err.scoreId)
            const update = {
              _id: err.scoreId,
              state: true,
              rated: true
            }
            this.handleSave({ ...info, ...update })
          }
        })
    }
  };

  handleSave = row => {
    console.log(row)
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData)
    console.log(this.state.dataSource)
    this.setState({
      dataSource: newData,
    });
  }

  handleRelease = () => {
    console.log('fabu')
    axios.put(config.url.putComplete, qs.stringify({
      activityId: this.props.activityId
    }))
      .then(res => {
        console.log(res)
        const message = {
          info: '发布成功',
          type: 'success',
          disable: true
        }
        this.setState({
          message: message
        })
      })
      .catch(e => {
        const message = {
          info: e.Error,
          type: 'error'
        }
        this.setState({
          message: message
        })
        console.log(e)
      })
  }

  componentDidMount() {
    axios.get(config.url.getRatelist, {
      params: {
        activityId: this.props.activityId
      }
    })
      .then(res => {
        console.log(res.data)
        const items = []
        res.data.unRated.forEach(item => {
          console.log(item)
          const info = {}
          const { studentInfo, ...rest } = item
          const { _id, ..._studentInfo } = studentInfo
          info.key = item.studentInfo._id //学生id
          info._id = rest._id // 报名id
          info.rated = false
          info.performance = ''
          info.score = 0
          info.state = true
          info.message = '提交'
          items.push({ ...info, ..._studentInfo })
        })
        res.data.rated.forEach(item => {
          console.log(item)
          const info = {}
          const { studentInfo, ...rest } = item
          const { _id, ..._studentInfo } = studentInfo
          info.key = item.studentInfo._id //学生id
          info._id = rest._id // 分数id
          info.rated = true
          info.performance = rest.performance
          info.score = rest.score
          info.state = true
          info.message = '确认修改'
          items.push({ ...info, ..._studentInfo })
        })
        console.log(items)
        this.setState({
          dataSource: items
        })
      })
      .catch(e => console.log(e))
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className='enroForm'>
        <Alert className='alert' message={this.state.message.info} type={this.state.message.type} />
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <Popconfirm title='确认发布？发布后无法再修改成绩' disabled={this.state.message.disable} onConfirm={this.handleRelease}>
          <Button danger block disabled={this.state.message.disable}>发布成绩</Button>
        </Popconfirm>
      </div>
    );
  }
}

export default RateTable

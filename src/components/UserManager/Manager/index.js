import React, { useState, useEffect } from 'react'
import history from '../../history'
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { axios, config } from '../../config';
import XLSX from 'xlsx'

class Manager extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    selectedRowKeys: [],
    data: []
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
          text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handelOperation = (record) => {
    console.log(record.key)
    history.push(`/a/user/manage/${record.key}`)
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };


  componentDidMount() {
    axios
      .get(config.url.getStudent)
      .then(res => {
        console.log(res)
        res.data.forEach(item => {
          item.key = item._id
        })
        this.setState({
          data: res.data
        })
        console.log(this.state.data)
      })
  }

  handleExportAll = () => {
    this.handleExport(this.state.data)
  }

  getFilterdData = () => {
    const { data, selectedRowKeys } = this.state
    const filteredData = data.filter(item => {
      return selectedRowKeys.indexOf(item.key) !== -1
    })
    return filteredData
  }

  handleExportSelect = () => {
    const Data = this.filteredData()
    this.handleExport(Data)
  }

  handleDeleteSelect = () => {
    const Data = this.filteredData()
    axios.delete(config.url)
  }

  handleExport = (e) => {
    const entozh = {
      "name": "姓名",
      "number": "学号",
      "class": "班级",
      "school": "学院",
      "grade": "年级",
      "total": "总分",
      "A": "模块A",
      "B": "模块B",
      "C": "模块C",
      "D": "模块D"
    }

    const nowdata = e;

    const json = nowdata.map((item) => {
      return Object.keys(item).reduce((newData, key) => {

          const newKey = entozh[key] || key
          newData[newKey] = item[key]
          return newData

      }, {})
    });

    const sheet = XLSX.utils.json_to_sheet(json);

    this.openDownloadDialog(this.sheet2blob(sheet, undefined), `info.xlsx`);
  }

  openDownloadDialog = (url, saveName) => {
    if (typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }
  sheet2blob = (sheet, sheetName) => {
    sheetName = sheetName || 'sheet1';
    var workbook = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

    var wopts = {
      bookType: 'xlsx', // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }); // 字符串转ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    return blob;
  }

  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '学号',
        dataIndex: 'number',
        key: 'number',
        width: '20%',
        ...this.getColumnSearchProps('number'),
      },
      {
        title: '班级',
        dataIndex: 'class',
        key: 'class',
        ...this.getColumnSearchProps('class'),
      },
      {
        title: '学院',
        dataIndex: 'school',
        key: 'school',
        ...this.getColumnSearchProps('school'),
      },
      {
        title: '年级',
        dataIndex: 'grade',
        key: 'grade',
        ...this.getColumnSearchProps('grade'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.data.length >= 1
            ? (
              <Button
                onClick={() => { this.handelOperation(record) }}
              >更多</Button>
            )
            : null,
      },
    ];
    return (
      <div className="enroForm shadow">
        <Button type="primary" className='btn-left' onClick={this.handleExportAll}>Excel导出全部数据</Button>
        <Button className='btn-left' onClick={this.handleExportSelect} disabled={selectedRowKeys.length === 0} >Excel导出已选数据</Button>
        <Button danger className='btn-left' disabled onClick={this.handleExportAll}>删除已选数据</Button>
        <Table columns={columns} rowSelection={rowSelection} dataSource={this.state.data} />
      </div>
    )
  }
}

export default Manager

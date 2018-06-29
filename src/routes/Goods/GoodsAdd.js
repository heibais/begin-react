import React from 'react';
import { connect } from 'dva/index';
import { routerRedux } from 'dva/router';
import {
  Tabs,
  Button,
  Form,
  Card,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Checkbox,
  Switch,
  TreeSelect,
} from 'antd';
import LzEditor from 'react-lz-editor';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getUserId } from '../../utils/global';
import ImgUpload from '../../components/Upload/ImgUpload';
import ImgUploads from '../../components/Upload/ImgUploads';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
@Form.create()
class GoodsAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      markdownContent: '## HEAD 2 \n markdown examples \n ``` welcome ```',
      isPromote: false,
      categoryTreeData: [],
    };
  }

  componentDidMount() {
    // 查询分类列表
    this.props.dispatch({
      type: 'goods/fetchCategory',
      payload: { userId: this.state.userId },
      callback: this.formatTreeSelect,
    });
    // 查询品牌列表
    this.props.dispatch({
      type: 'goods/fetchBrand',
      payload: { userId: this.state.userId },
    });
    // 查询供应商列表
    this.props.dispatch({
      type: 'goods/fetchSupplier',
      payload: { userId: this.state.userId },
    });
  }

  formatTreeSelect = () => {
    let data = this.props.goods.categoryList;
    function format(data) {
      let treeData = [];
      data.map((item, index) => {
        if (item.status === 0) return false;
        const obj = {};
        obj.label = item.name;
        obj.value = item.id.toString();
        obj.key = item.key.toString();
        if (item.children) {
          obj.children = format(item.children);
        }
        treeData[index] = obj;
      });
      return treeData;
    }
    const categoryTreeData = format(data);
    this.setState({ categoryTreeData });
  };

  receiveHtml = content => {
    this.props.setFieldsValue({ goodsDesc: content });
  };

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {};
        const { ifPromote, recommend } = values;
        if (recommend && recommend.length > 0) {
          recommend.forEach(item => (values[item] = 1));
        }
        if (ifPromote) {
          const promoteTime = {
            promoteStartTime: values.promoteTime[0].format('YYYY-MM-DD HH:mm:ss'),
            promoteEndTime: values.promoteTime[1].format('YYYY-MM-DD HH:mm:ss'),
          };
          Object.assign(data, values, promoteTime);
        }

        console.log('Received values of form: ', values);
        console.log('Received values of form: ', data);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { goods: { brandList, supplierList }, loading } = this.props;
    const operations = (
      <div>
        <Button
          type="default"
          icon="rollback"
          onClick={() => this.props.dispatch(routerRedux.push('goods'))}
        >
          返回列表
        </Button>
        &nbsp;
        <Button type="primary" onClick={this.handleSubmit}>
          确定
        </Button>
      </div>
    );
    const selectUnitAfter = (
      <Select defaultValue="KG" style={{ width: 80 }}>
        <Option value="KG">千克</Option>
        <Option value="G">克</Option>
      </Select>
    );
    const recommendOptions = [
      { label: '精品', value: 'ifBest' },
      { label: '新品', value: 'ifNew' },
      { label: '热销', value: 'ifHot' },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false} loading={loading}>
          <Form>
            <Tabs tabBarExtraContent={operations}>
              <TabPane tab="通用信息" key="1">
                {getFieldDecorator('id')(<Input type="hidden" />)}
                {getFieldDecorator('goodsDesc')(<Input type="hidden" />)}
                <FormItem label="商品名称" {...formItemLayout}>
                  {getFieldDecorator('goodsName', {
                    rules: [{ required: true, message: '请填写商品名称', whitespace: true }],
                  })(<Input autoComplete="off" placeholder="请填写商品名称" />)}
                </FormItem>
                <FormItem label="商品主图" {...formItemLayout}>
                  {getFieldDecorator('goodsImg', {
                    rules: [{ required: true, message: '请上传商品图片', whitespace: true }],
                    initialValue: this.state.currBrandLogo,
                    getValueFromEvent: res => {
                      return res.msg;
                    },
                  })(<ImgUpload />)}
                </FormItem>
                <FormItem
                  label="商品货号"
                  {...formItemLayout}
                  extra="如果您不输入商品货号，系统将自动生成一个唯一的货号。"
                >
                  {getFieldDecorator('goodsSn')(<Input autoComplete="off" />)}
                </FormItem>
                <FormItem label="商品分类" {...formItemLayout}>
                  {getFieldDecorator('categoryId', {
                    rules: [{ required: true, message: '请选择商品分类' }],
                  })(<TreeSelect treeData={this.state.categoryTreeData} />)}
                </FormItem>
                <FormItem label="商品品牌" {...formItemLayout}>
                  {getFieldDecorator('brandId', {
                    rules: [{ required: true, message: '请选择商品品牌' }],
                  })(
                    <Select placeholder="请选择商品品牌">
                      {brandList &&
                        brandList.map((item, index) => {
                          return (
                            <Option key={`brand${index}`} value={item.id}>
                              {item.brandName}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="商品供应商" {...formItemLayout}>
                  {getFieldDecorator('supplierId', {
                    rules: [{ required: true, message: '请选择商品供应商' }],
                  })(
                    <Select placeholder="请选择商品供应商">
                      <Option value={0}>自身供货</Option>
                      {supplierList &&
                        supplierList.map((item, index) => {
                          return (
                            <Option key={`supplier${index}`} value={item.id}>
                              {item.supplierName}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="本店售价" {...formItemLayout}>
                  {getFieldDecorator('goodsPrice', {
                    rules: [{ required: true, message: '请填写本店售价' }],
                    initialValue: 0.0,
                  })(<InputNumber min={0} precision={2} />)}
                  <span className="ant-form-text"> 元</span>
                </FormItem>
                <FormItem label="市场售价" {...formItemLayout}>
                  {getFieldDecorator('marketPrice', {
                    rules: [{ required: true, message: '请填写市场售价' }],
                    initialValue: 0.0,
                  })(<InputNumber min={0} precision={2} />)}
                  <span className="ant-form-text"> 元</span>
                </FormItem>
                <FormItem label="是否促销" {...formItemLayout}>
                  {getFieldDecorator('ifPromote')(
                    <Switch onChange={isPromote => this.setState({ isPromote })} />
                  )}
                </FormItem>
                {this.state.isPromote ? (
                  <div>
                    <FormItem label="促销价" {...formItemLayout}>
                      {getFieldDecorator('promotePrice', {
                        rules: [{ required: true, message: '请填写促销价' }],
                        initialValue: 0.0,
                      })(<InputNumber min={0} precision={2} />)}
                      <span className="ant-form-text"> 元</span>
                    </FormItem>
                    <FormItem label="促销日期" {...formItemLayout}>
                      {getFieldDecorator('promoteTime', {
                        rules: [{ required: true, message: '请选择促销日期' }],
                      })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
                    </FormItem>
                  </div>
                ) : (
                  ''
                )}
              </TabPane>
              <TabPane tab="详细描述" key="2">
                <LzEditor
                  active={true}
                  importContent={this.state.markdownContent}
                  cbReceiver={this.receiveHtml}
                  image={false}
                  video={false}
                  audio={false}
                  convertFormat="markdown"
                />
              </TabPane>
              <TabPane tab="其他信息" key="3">
                <FormItem label="商品重量" {...formItemLayout}>
                  {getFieldDecorator('goodsWeight', {
                    rules: [{ required: true, message: '请填写商品重量', whitespace: true }],
                  })(<Input addonAfter={selectUnitAfter} autoComplete="off" />)}
                </FormItem>
                <FormItem label="商品库存数量" {...formItemLayout}>
                  {getFieldDecorator('goodsNumber', {
                    rules: [{ required: true, message: '请填写商品库存数量' }],
                    initialValue: 0.0,
                  })(<InputNumber min={0} />)}
                  <span className="ant-form-text"> 件</span>
                </FormItem>
                <FormItem label="库存警告数量" {...formItemLayout}>
                  {getFieldDecorator('warnNumber', {
                    rules: [{ required: true, message: '请填写库存警告数量' }],
                    initialValue: 10,
                  })(<InputNumber min={0} />)}
                  <span className="ant-form-text"> 件</span>
                </FormItem>
                <FormItem label="加入推荐" {...formItemLayout}>
                  {getFieldDecorator('recommend')(<CheckboxGroup options={recommendOptions} />)}
                </FormItem>
                <FormItem label="上架" {...formItemLayout}>
                  {getFieldDecorator('ifOnSale', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(<Switch />)}
                </FormItem>
                <FormItem label="是否免运费" {...formItemLayout}>
                  {getFieldDecorator('noFreight', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(<Switch />)}
                </FormItem>
                <FormItem label="商品关键字" {...formItemLayout}>
                  {getFieldDecorator('keyWords')(
                    <Input placeholder="请输入关键字, 使用英文逗号分隔" />
                  )}
                </FormItem>
                <FormItem label="商品简单描述" {...formItemLayout}>
                  {getFieldDecorator('goodsBrief')(<TextArea />)}
                </FormItem>
                <FormItem label="商家备注" {...formItemLayout} extra="仅供商家自己看的信息">
                  {getFieldDecorator('ownerRemark')(<TextArea />)}
                </FormItem>
              </TabPane>
              <TabPane tab="商品相册" key="4">
                {getFieldDecorator('goodsBatchImg', {
                  getValueFromEvent: res => {
                    return res;
                  },
                })(<ImgUploads />)}
              </TabPane>
            </Tabs>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default GoodsAdd;

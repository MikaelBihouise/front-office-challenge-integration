import React, {useState} from 'react'
import { Row, Col, Select, Card, Empty, Carousel, Divider, Table } from 'antd';
import { RightCircleOutlined, LeftCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, width: '30px', height: '30px', borderRadius:'50%', right: '-50px' }}
      onClick={onClick}
    >
      <RightCircleOutlined  style={{fontSize: '30px'}}/>
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, width: '30px', height: '30px', borderRadius:'50%', left: '-50px'}}
      onClick={onClick}
    >
      <LeftCircleOutlined style={{fontSize: '30px'}}/>
    </div>
  );
}

function App() {

  const { Option } = Select;
  const { Meta } = Card;

  const [eventNumber, setEventNumber] = useState<number>(0);
  const [eventSelected, setEventSelected] = useState<any[]>([]);
  const data = require('./data.json');
  const dataSelect: any[] = [];

  
  for(let i=0; i<data.nextEvent.length; i++) {
    dataSelect.push(<Option value={data.nextEvent[i].sportTitle} key={data.nextEvent[i].id}>{data.nextEvent[i].sportTitle}</Option>)
  }

  const handleChange = (value: string) => {
    setEventSelected(prevData => [...prevData, value]);
    setEventNumber(eventNumber + 1);
  }

  const handleRemoveChange = (value: any) => {
    setEventNumber(eventNumber - 1);
    setEventSelected(eventSelected.filter((name: string) => name !== value));
  }

  let showNextEvent: any;
  
  const settings = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  if(eventNumber === 0) {
    settings.slidesToShow = 1;
    showNextEvent = <Empty 
    description={
      <span>
        Aucune épreuve de prévu
      </span>
    }
  />
  } else {
    settings.slidesToShow = 3;
    showNextEvent = data.nextEvent.filter((e: any) => {
      return eventSelected.includes(e.sportTitle)
    })
    .map((e: any) => {
      return (
        <Col style={{paddingTop: 25, position: 'relative'}}>    
          <Card
            key={e.id}
            hoverable
            style={{ width: 240 }}
            className='card-component'
            cover={ <img alt={e.sportTitle} src={e.pictureUrl} className='card-image' /> }
          >
            <Meta title={e.sportTitle} description={moment.unix(e.date).format('DD/MM/YYYY, h:mm')} />
          </Card>
        </Col>
      )
    });
  };

  const columns = [
    {
      title: 'Pays',
      dataIndex: 'country',
      key: 'country'
    },
    {
      title: 'Or',
      dataIndex: ['medals', 'gold'],
      sorter: {
        compare: (a: any, b: any) => a.medals.gold - b.medals.gold,
      },
    },
    {
      title: 'Argent',
      dataIndex: ['medals', 'silver'],
      sorter: {
        compare: (a: any, b: any) => a.medals.silver - b.medals.silver,
      },
    },
    {
      title: 'Bronze',
      dataIndex: ['medals', 'bronze'],
      sorter: {
        compare: (a: any, b: any) => a.medals.bronze - b.medals.bronze,
      },
      key: 'bronze',
    },
    {
      title: 'Total',
      sorter: {
        compare: (a: any, b: any) => (a.medals.gold + a.medals.silver + a.medals.bronze) - (b.medals.gold + b.medals.silver + b.medals.bronze),
      },
      key: 'total',
      render: (a: any) => {
        return <span>{a.medals.gold + a.medals.silver + a.medals.bronze}</span>
      }
    }
  ];

  function onChangeTable( filters: any, sorter: any, extra: any) {
    console.log('params', filters, sorter, extra);
  }

  return (
    <div>
      <Row>
        <Col flex="auto" className="header" >J0 2020</Col>
      </Row>
      <Row justify="center" style={{paddingTop: 25}}>
          <Col span={20}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Séléctionner un sport"
              optionLabelProp="label"
              onSelect={handleChange}
              onDeselect={handleRemoveChange}
            >
            {dataSelect}
            </Select>
          </Col>
      </Row>
      <Row justify="center" style={{paddingTop: 25}}>
        <Col span={20}>
          <h2>Prochaines épreuves</h2>
        </Col>
      </Row>
      <Row justify="center" gutter={24} style={{marginLeft: 0, marginRight: 0, paddingTop: 15}}>
        <Col span={20}>
          <Carousel {...settings}>
            {showNextEvent}
          </Carousel>
        </Col>
      </Row>
      <Row justify="center" style={{paddingTop: 15}}>
        <Col span={20}>
          <Divider />
        </Col>
      </Row>
      <Row justify="center" style={{paddingTop: 15, paddingBottom: 30}}>
        <Col span={20}>
          <h2>Médailles</h2>
          <Table columns={columns} dataSource={data.medals} onChange={onChangeTable} pagination={false} />
        </Col>
      </Row>
    </div>
  )
}

export default App

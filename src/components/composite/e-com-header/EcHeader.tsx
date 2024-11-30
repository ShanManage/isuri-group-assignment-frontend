import React, { useState } from 'react';
import styles from './EcHeader.module.scss';
import {
  MenuOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Divider, Drawer, Flex, Image, List, Typography } from 'antd';
import logo from '../../../assets/logo.svg'
import { EcIcon, EcInput } from '../../atom';

const { Text, Title } = Typography

const EcHeader: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const data = [
    { text: "My Cart" },
  ];

  return (
    <header className={styles.header}>
      <Flex justify='space-between' align='center'>
        {/* Mobile Menu Icon */}
        <div className={styles.mobile}>
          <EcIcon icon={MenuOutlined} onClick={toggleDrawer} />
        </div>

        {/* Logo Centered on Mobile */}
        <Title className='zero-margin' type='warning'>IRUSRI-ECOM</Title>
        <div className={styles.mobile}></div>


        {/* Desktop Search Bar */}
        <div className={styles.search}>
          <EcInput placeholder="What are you looking for ...?" type='search' suffix={<SearchOutlined />}/>
        </div>

        {/* Desktop Icons */}
        <Flex justify='space-between' align='center' gap={20} className={styles.desktopIcons}>
          <EcIcon icon={ShoppingCartOutlined} text="My Cart" onClick={() => { }} count={3} />
        </Flex>
      </Flex>
      <Divider className='zero-margin'/>

      {/* Fullscreen Drawer for Mobile */}
      <Drawer
        title={
          <Flex justify='center' align='center'>
            <Image src={logo} preview={false} width={150} alt="Logo"/>
          </Flex>
        }
        placement="right"
        onClose={toggleDrawer}
        open={drawerVisible}
        width="100%"
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item onClick={() => { }}>
              <Text strong>{item.text}</Text>
            </List.Item>
          )}
        />
      </Drawer>
    </header>
  );
};

export default EcHeader;
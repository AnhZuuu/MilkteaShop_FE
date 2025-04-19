'use client'
import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';

const Header: React.FC = () => {
    const [current, setCurrent] = useState('homepage');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center', backgroundColor:'#2596be', padding:'10px'}}>
            <Link

                href='/'
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-transparent rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray mr-20"
            >
                Trang chủ
            </Link>
            <div>
            <Link href='/schools'
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-transparent rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-white focus:bg-white mr-20"
            >
                Trường
            </Link>
            <Link href='/news'
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-transparent rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-white focus:bg-white mr-20"
            >
                Tin tức
            </Link>
            <Link href='/blogs'
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-transparent rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-white focus:bg-white mr-20"
            >
                Chia sẻ
            </Link>
            </div>
            <Link
                href='/premium'
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-white rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-white focus:bg-white mr-20"
            >
                Nâng cấp
            </Link>
        </div>
    </>;
};

export default Header;
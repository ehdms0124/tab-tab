import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
    vertical-align: middle;
`;

// 공통적으로 쓸 레이아웃
const AppLayout = ({ children }) => {
    const { me } = useSelector(state => state.user);
    const [searchInput, onChangeSearchInput] = useInput('');

    const onSearch = useCallback(() => {
        Router.push(`/hashtag/${searchInput}`);
    }, [searchInput]);


    return (
        <div style={{ background: "#bbddfb"}}>
            <Menu mode="horizontal">
                <Menu.Item>
                    <Link href="/"><a>TAB TAB!</a></Link>
                </Menu.Item>

                <Menu.Item>
                    <Link href="/profile"><a>프로필</a></Link>
                </Menu.Item>
                <Menu.Item>
                    <SearchInput
                        enterButton
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onSearch={onSearch}
                    />
                </Menu.Item>

                <Menu.Item>
                    <Link href="/signup"><a>회원가입</a></Link>
                </Menu.Item>

            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={13}>
                    {children}
                </Col>
                <Col xs={24} md={4}>
                </Col>
            </Row>
        </div>
    )
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;
// 모든 페이지들의 공통적인 것 처리
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';  //헤드 수정 가능
import 'antd/dist/antd.css';

import wrapper from "../store/configureStore";


const App = ({ Component }) => {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>TAB TAB!</title>
            </Head>
            <Component />
        </>
    )
};

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
}

export default wrapper.withRedux(App);
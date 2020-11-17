import React, {useCallback, useMemo} from 'react';
import { Form, Input } from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {CHANGE_NICKNAME_REQUEST} from "../reducers/user";
import useInput from "../hooks/useInput";

const NicknameEditForm = () => {
    const { me } = useSelector((state) => state.user);
    const [nickname, onChangeNickname] = useInput(me?.nickname || '');
    const dispatch = useDispatch();

    const onSubmit = useCallback(() => {
        dispatch({
            type: CHANGE_NICKNAME_REQUEST,
            data: nickname,
        });
    }, [nickname]);

    return (
        <Form style={{ marginTop:20, marginBottom: '20px', padding: '7px', background: "#7aaada"}}>
            <Input.Search
                value={nickname}
                onChange={onChangeNickname}
                addonBefore="닉네임"
                enterButton="수정"
                onSearch={onSubmit}
            />
        </Form>
    )
};

export default NicknameEditForm;
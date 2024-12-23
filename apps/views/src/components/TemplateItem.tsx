import { Box, Button, IconButton, ListItem, Tooltip } from "@mui/material";
import { Template } from "../types/template";
import styled from "@emotion/styled";
import { MouseEvent } from "react";
import { Delete } from "@mui/icons-material";

interface TemplateItemProp {
    template: Template;
    isSelect: boolean;
    onSelected: (template: Template, evt: MouseEvent) => void|Promise<void>;
    onRemove: (template: Template) => void|Promise<void>;
}

const Wrapper = styled(ListItem)(({ theme }) => ({
}))

export default function(props: TemplateItemProp) {
    function onClick(evt: MouseEvent) {
        props.onSelected(props.template, evt);
    }
    function onRemove() {
        props.onRemove(props.template);
    }
    return <Wrapper alignItems="flex-start">
        <Button fullWidth variant={props.isSelect ? 'contained' : 'outlined'} onClick={onClick}>
            {props.template.name}
        </Button>
        <Tooltip title="템플릿 삭제">
            <IconButton color="error" style={{ marginLeft: 10 }} onClick={onRemove}>
                <Delete />
            </IconButton>
        </Tooltip>
    </Wrapper>;
}
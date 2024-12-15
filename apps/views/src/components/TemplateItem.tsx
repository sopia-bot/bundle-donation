import { Box } from "@mui/material";
import { Template } from "../types/template";

interface TemplateItemProp {
    template: Template;
}

export default function(props: TemplateItemProp) {
    return <Box>
        {props.template.name}11
    </Box>;
}
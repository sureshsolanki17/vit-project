export interface PdfSchema {
    alias: string
    base_template_id: string
    children: PdfSchema[]
    data_type: string
    elementTag: string
    element_id: string
    fieldName: string
    fieldType: string
    jsonTag: string
    key: string
    parent_id: string
    styles: Styles
    template: string
}


export interface Styles {
    body: any
    header: any
}
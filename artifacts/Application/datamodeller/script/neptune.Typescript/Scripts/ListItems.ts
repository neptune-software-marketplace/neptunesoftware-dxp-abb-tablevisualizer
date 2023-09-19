function tipsTricksListItems () {
    const listItems = [
        {
            what:'Move table',
            how: 'Hold and drag',
        },
        {
            what:'Zoom in/out',
            how: 'Ctrl/cmd + mousewheel',
        },
        {
            what:'Move the canvas',
            how: 'Hold and drag',
        },
        {
            what:'Open table menu',
            how: 'Right-click on table',
        },
        {
            what:'Delete foreign key',
            how: 'Hover and click X',
        },
        {
            what:'Add foreign key',
            how: 'Drag and drop from column',
        },

    ]
    return listItems;
}

function legendListItems () {
    const listItems = [
        {
            code: 'P',
            description: 'Primary key'
        },
        {
            code: 'U',
            description: 'Unique'
        },
        {
            code: 'N',
            description: 'Nullable'
        },
    ]
    return listItems;
}
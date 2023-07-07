(function () {
    const datamodellerLibrary = document.createElement("script");
    datamodellerLibrary.type = "module";
    datamodellerLibrary.text = `
    import { Graph, Edge } from 'https://cdn.jsdelivr.net/npm/@antv/x6@2.11.1/+esm';
    import { MiniMap } from 'https://cdn.jsdelivr.net/npm/@antv/x6-plugin-minimap/+esm';
    import { History } from 'https://cdn.jsdelivr.net/npm/@antv/x6-plugin-history/+esm';
    import { Scroller } from 'https://cdn.jsdelivr.net/npm/@antv/x6-plugin-scroller/+esm';

    window.Graph = Graph;
    window.Edge = Edge;
    window.History = History;
    window.Scroller = Scroller;
    window.MiniMap = MiniMap;`;
    document.head.appendChild(datamodellerLibrary);
})();

namespace CustomComponent {
    export function getX6Objects() {
        return new Promise((resolve, reject) => {
            (function check() {
                //@ts-ignore
                if (typeof Graph === 'undefined') return setTimeout(check, 10);
                //@ts-ignore
                if (typeof Edge === 'undefined') return setTimeout(check, 10);
                //@ts-ignore
                if (typeof MiniMap === 'undefined') return setTimeout(check, 10);
                //@ts-ignore
                if (typeof History === 'undefined') return setTimeout(check, 10);
                //@ts-ignore
                if (typeof Scroller === 'undefined') return setTimeout(check, 10);
                //@ts-ignore
                resolve({ Graph, MiniMap, History, Scroller, Edge });
            })();
        });
    }
}

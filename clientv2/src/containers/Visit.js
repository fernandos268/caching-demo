import React, { useState, useEffect } from 'react'
import PageWrappers from '../hocs/PageWrappers'
import debounce from 'lodash/debounce'

function Visit() {
   const [referenceNode, setReferenceNode] = useState();
   const [delayOnType, setDelayOnType] = useState((0))
   const [listItems] = useState(Array.from(Array(30).keys(), (n) => n + 1));
   //  useEffect(() => {
   //     if(referenceNode) {
   //       return () => referenceNode.removeEventListener('scroll', handleScroll);
   //     }
   //  });

    return (
        <div
            style={{overflowY: 'scroll', maxHeight: '400px'}}
        >
            <ul>
                {listItems.map((listItem, i) => <li key={i}>List Item {listItem}</li>)}
            </ul>
        </div>
    );
}

export default PageWrappers(Visit, 'Visit')
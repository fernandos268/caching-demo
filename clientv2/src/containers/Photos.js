import React, { useState, useEffect } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  AutoSizer,
  Masonry
} from "react-virtualized";
import ImageMeasurer from 'react-virtualized-image-measurer';
import list from "./data";
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import GeneratFields from '../components/Generators'
import { PHOTOSBYVISIT } from '../request/query'



const keyMapper = (item, index) => item.image || index;

const columnWidth = 350;
const defaultHeight = 500;
const defaultWidth = columnWidth;

const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true
});

const cellPositionerConfig = {
  cellMeasurerCache: cache,
  columnCount: 4,
  columnWidth,
  spacer: 10
};

const cellPositioner = createMasonryCellPositioner(cellPositionerConfig);

const MasonryComponent = ({ itemsWithSizes, setRef }) => {
  const cellRenderer = ({ index, key, parent, style }) => {
    const { item, size } = itemsWithSizes[index];
    const height = columnWidth * (size.height / size.width) || defaultHeight;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div style={style}>
          <div>{item.title}</div>
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              style={{
                height: height,
                width: columnWidth,
                display: "block"
              }}
            />
          )}
        </div>
      </CellMeasurer>
    );
  };

  return (
    <Masonry
      cellCount={itemsWithSizes.length}
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      cellRenderer={cellRenderer}
      height={600}
      width={1500}
      keyMapper={keyMapper}
      ref={setRef}
    />
  );
};

class Index extends React.Component {
  state = { images: this.props.list || [] };

  masonryRef = null;
  componentDidMount() {
      const noCacheList = this.props.list.map((item, index) => ({
         title: item.visit_type,
         image: item.image + (item.image ? "?noCache=" + Math.random() : "")
      }));
      this.setState({ list: noCacheList || []})
  }
  // this shows how to significantly change the input array, if items will be only appended this recalculation is not needed
  shorten = () => {
    cache.clearAll();
    cellPositioner.reset(cellPositionerConfig);
    this.masonryRef.clearCellPositions();
    this.setState({ images: [...this.state.images.slice(1)] });
  };

  setMasonry = node => (this.masonryRef = node);

  render() {
    return (
      <div>
        <button onClick={this.shorten}>Resize</button>
        <ImageMeasurer
          items={this.state.images}
          image={item => item.image}
          keyMapper={keyMapper}
          onError={(error, item, src) => {
            console.error(
              "Cannot load image",
              src,
              "for item",
              item,
              "error",
              error
            );
          }}
          defaultHeight={defaultHeight}
          defaultWidth={defaultWidth}
        >
          {({ itemsWithSizes }) => (
            <MasonryComponent
              setRef={this.setMasonry}
              itemsWithSizes={itemsWithSizes}
            />
          )}
        </ImageMeasurer>
      </div>
    );
  }
}

function PhotosTab(props){
   const { parent_node, parent_node_id } = props
   const [number, setGenerate] = useState(25)
   const [fetchPhotos, { loading, data, error }] = useLazyQuery(PHOTOSBYVISIT)
   const [list, setList] = useState([]);

   useEffect(() => {
      fetchPhotos(getFetchParams())
   }, []);
   useEffect(() => {
      if(data) {
         setList(data.photosByVisit)
      }
   }, [data]);
   return (
      <div>
         <GeneratFields 
            number={number}
            handleGenerateGrid={handleGenerateGrid}
            handleChangeGenerate={handleChangeGenerate}
            style={{ marginTop: 50 }}
         />
         <Index list={list}/>
      </div>
   )
   function handleChangeGenerate(evt) {
      const { id, value } = evt.target
      setGenerate(value)
    }

   function handleGenerateGrid() {
      const limit = Number(number)

      if(!limit && typeof(limit) === 'number') {
         return alert('invalid input')
      }
      fetchPhotos(getFetchParams(number))
   }

   function getFetchParams(limit = 25, refetch) {
      limit = Number(limit)
      return { 
        variables: {
          "params": {
            limit,
            "page": 1
          },
        }
       }
    }
}
export default PhotosTab;

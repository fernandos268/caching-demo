import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

export default function loading() {
  return (
    <div>
      <Skeleton animation="wave" variant="text" width={1300} height={50}/>
      <Skeleton animation="wave" variant="circle" width={80} height={80} />
      <Skeleton animation="wave" variant="text" width={1300} height={100} />
      <Skeleton animation="wave" variant="rect" width={1300} height={300} />
      <Skeleton animation="wave" variant="text" width={900} height={50} />
      <Skeleton animation="wave" variant="text" width={600} height={50} />
    </div>
  );
}

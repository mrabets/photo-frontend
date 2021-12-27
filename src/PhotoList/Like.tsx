import { useState, useEffect } from 'react';
import { RiThumbUpLine, RiThumbUpFill } from 'react-icons/ri';
import axios from 'axios';

export function Like(props: { photo_id: number; }) {
  const [liked, setLiked] = useState(false)
  const [like_count, setLikeCount] = useState(0)

  useEffect(() => {
    getLike()
    getLikeCount()
  }, []);

  function getLike() {
    axios
      .get(process.env.REACT_APP_API_URL + `/api/v1/photos/${props.photo_id}/like_status`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => response.data)
      .then(data => {setLiked(data.status)}) 
      .catch(error => console.log(error.response))
  }

  function getLikeCount() {
    axios
      .get(process.env.REACT_APP_API_URL + `/api/v1/photos/${props.photo_id}/like_count`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      .then(response => response.data)
      .then(data => {setLikeCount(data.like_count)}) 
      .catch(error => console.log(error.response))
  }

  const onClick = () => {
    setLiked(!liked)

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }

    liked ? onUnlike(headers) : onLike(headers)
  }

  const onLike = (headers: { 'Content-Type': string; Authorization: string; }) => {
    axios
    .post(process.env.REACT_APP_API_URL + `/api/v1/photos/${props.photo_id}/likes`, null,  
      { headers: headers }
    )
    .then(response => {
      setLiked(true);
      setLikeCount(like_count + 1)
    })
    .catch(error => console.log(error.response.data.error))
  }

  const onUnlike = (headers: { 'Content-Type': string; Authorization: string; }) => {
    axios
    .delete(process.env.REACT_APP_API_URL + `/api/v1/photos/${props.photo_id}/likes`,  
      { headers: headers }
    )
    .then(() => {
      setLiked(false)
      setLikeCount(like_count - 1)
    })
    .catch(error => console.log(error.response.data.error))
  }

  return ( 
    <>
    <button onClick={onClick} className='Like-button'>
      { liked ? <RiThumbUpFill /> : <RiThumbUpLine />}      
    </button>
    
    {like_count}
    </>
  )
}
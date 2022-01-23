import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import React, { useState } from 'react';

export default function Home() {
  const [img, setImg] = useState([])
  const [error, setError] = useState([])
  const [spinner, setSpinner] = useState(false)

  const submit = async event => {
    event.preventDefault()
    setError('')
    setImg('')
    setSpinner(true)

    axios.post('https://api.ntools.tech', {
      vpa: event.target.vpa.value,
      name: event.target.name.value,
      amount: event.target.amount.value,
      remarks: event.target.remarks.value
    }, { responseType: 'blob' })
      .then(async ({ data }) => {
        setSpinner(false)
        setError('')
        if (data.type == 'application/json') {
          let json = await data.text()
          let error = JSON.parse(json)
          return setError(error.error)
        }
        let img = URL.createObjectURL(data)
        setImg(img)
      })
      .catch(e => {
        setSpinner(false)
        setError('Server Not Responding')
      })

  }


  const typing = () => {
    setImg('')
    setError('')
  }
  return (
    <div className='container pt-3'>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
      </link>
      <div className='text-center'>
        <h1 className='text-success'>UPI DYNAMIC QR</h1>
      </div>
      <div className=' pt-3'>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">VPA</label>
          <input type="text" name='vpa' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing}></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
            <input type="text" name='name' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing}></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
            <input type="number" name='amount' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing}></input>
        </div>
        <div className="mb-3">
          <label className="form-label">Remarks</label>
            <input type="text" name='remarks' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing}></input>
        </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary mb-3">Submit</button>
        </div>
      </form>

      <div className='text-center'>
          {/* <img src={img}></img> */}
          {spinner ? <div className="spinner-grow text-success" role="status"></div> : ''}
          {/* {img != '' ? <div><h3 className="text-danger">Scan To Pay</h3><Image src={ img } alt='sdfs' width='200' height='200' /><br /><Image src='/upi-logo.png' alt='sdfs' width='80' height='40' /></div> : ''} */}
          {img != '' ? <div><h3 className="text-danger">Scan To Pay</h3><Image src={ img } alt='sdfs' width='200' height='200' /></div> : ''}
        <div>
        {error != '' ? <h1 className="text-danger">{error}</h1> : ''}
        </div>
        </div>
      </div>
    </div>
  )
}

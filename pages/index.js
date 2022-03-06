import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import React, { useState } from 'react';

export default function Home() {
  const [img, setImg] = useState([])
  const [error, setError] = useState([])
  const [spinner, setSpinner] = useState(false)
  const [btn, setBtn] = useState('Copy Link')
  const [link, setLink] = useState([])

  const submit = async event => {
    event.preventDefault()
    setError('')
    setImg('')
    setSpinner(true)
    setBtn('Copy Link')

    let vpa = event.target.vpa.value
    let name = event.target.name.value
    let amount = event.target.amount.value
    let remarks = event.target.remarks.value

    setLink(`upi://pay?pa=${vpa}&pn=${name}&am=${amount}.00&cu=INR&tn=${remarks}`)

    axios.post('https://api.ntools.tech', {
      vpa,
      name,
      amount,
      remarks
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

  const copyLink = () => {
    navigator.clipboard.writeText(link)
      .then(() => setBtn('Copied✔'))
      .catch(e => setBtn('😒❌'))
  }

  return (
    <div className='container pt-3 text-white'>
      <meta name="theme-color" content="#615a9b" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
      </link>
      <div className='text-center'>
        <h1 className='text-white' style={{ fontFamily: 'Times New Roman' }}>UPI DYNAMIC QR GENERATOR</h1>
      </div>
      <div className=' pt-2'>
        <form onSubmit={submit}>
          <div className="mb-2">
            <label className="form-label" style={{ fontFamily: 'Cursive', fontSize: '15px', fontWeight: 'bold' }}>VPA</label>
            <input type="text" name='vpa' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing} required></input>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontFamily: 'Cursive', fontSize: '15px', fontWeight: 'bold' }}>Name</label>
            <input type="text" name='name' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing} required></input>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontFamily: 'Cursive', fontSize: '15px', fontWeight: 'bold' }}>Amount</label>
            <input type="number" min="1" max="100000" name='amount' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing} required></input>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ fontFamily: 'Cursive', fontSize: '15px', fontWeight: 'bold' }}>Remarks</label>
            <input type="text" name='remarks' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onKeyDown={typing}></input>
          </div>
          <div className="text-center">
            {spinner ? <button type="submit" className="btn btn-success mb-3 btn-lg" style={{ fontFamily: 'Cursive', fontSize: '15px', fontWeight: 'bold' }}>Generating...</button> : <button type="submit" className="btn btn-warning mb-3 btn-lg" style={{ fontFamily: 'Cursive', fontSize: '15px', fontWeight: 'bold' }}>Submit</button>}
          </div>
        </form>

        <div className='text-center'>
          {/* <img src={img}></img> */}
          {spinner ? <div className="spinner-grow text-white" role="status"></div> : ''}
          {/* {img != '' ? <div><h3 className="text-danger">Scan To Pay</h3><Image src={ img } alt='sdfs' width='200' height='200' /><br /><Image src='/upi-logo.png' alt='sdfs' width='80' height='40' /></div> : ''} */}
          {img != '' ? <div><h3 className="text-white" style={{ fontFamily: 'Cursive' }}>Scan To Pay</h3><a href={img} ><img src={img} className="img-corner" alt='sdfs' width='200' height='200' /></a></div> : ''}
          <div>
            {error != '' ? <h1 className="text-danger">{error}</h1> : ''}
          </div>
          <br />
          {img != '' ? <div>
            <button type="button" className="btn btn-outline-warning" onClick={copyLink}>{btn}</button>
          </div> : ''}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import {Container,Card} from 'react-bootstrap'
import logonew from '../../assets/img/logo.png'

export default function Appdetails() {
  return (
    <>
      <section id="appdetials" className='margin-bottom-88'>
            <Container fluid>
                <div className="detailsapplication">
                    <div className="bg-img">
                        <img src={logonew}/>
                    </div>
                </div>
                <Card>
                       <div className="detailscard">
                       <h6><strong>TM Application:369852114751</strong></h6>
                       </div>
                    </Card>
                <Card>
                       <div className="detailscard">
                       <h6><strong>ARN Number:369852114751</strong></h6>
                       </div>
                    </Card>
                <Card>
                       <div className="detailscard">
                       <h6><strong>Provisional ID:369852114751</strong></h6>
                       </div>
                    </Card>
            </Container>
      </section>
    </>
  )
}

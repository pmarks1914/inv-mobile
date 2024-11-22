import { EyeIcon, HashtagIcon, TrashIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import {
    Card, CardText, CardBody, CardTitle, Pagination, PaginationItem, PaginationLink, Container, Row, Col, Label, CardFooter, Button
} from 'reactstrap';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';



// console.log("invoiceGetData ", invoiceGetData)
const Dashboard = () => {

    // get old invoice list
    let invoiceGetData = JSON.parse(localStorage.getItem("invoice"));

    const [invoiceList, setInvoiceList] = useState(invoiceGetData ? invoiceGetData.sort((post, newpost) => new Date(post.timeStamp) - new Date(newpost.timeStamp)).reverse()  : []   )
    useEffect(() => {
        invoiceGetData = invoiceGetData ? invoiceGetData.sort((post, newpost) => new Date(post.timeStamp) - new Date(newpost.timeStamp)).reverse() : []        
    }, [])


    const cardsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(invoiceList?.length / cardsPerPage);
  
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = invoiceList?.slice(indexOfFirstCard, indexOfLastCard);
  
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    function storeInvoiceRecord(item){
        // set invoice
        localStorage.setItem("old-invoice", JSON.stringify(item));
        
        window.location.href ="/dashboard-view-invoice"
    }
    function removeInvoiceRecord(item, id){
        // 
        let deletedData = invoiceList?.filter((_, index) => index !== id);
        invoiceGetData = deletedData

        Swal.fire({
            icon: 'info',
            title: 'Action delete',
            text: 'Proceed to delete',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: "Cancel",
            cancelButtonColor: 'red',
            confirmButtonColor: 'blue'
          }).then((result) => {
            if (result.isConfirmed) {
                // set invoice
                localStorage.setItem("invoice", JSON.stringify(deletedData));
                setInvoiceList(deletedData)
              }
              else{
                // 
              }
          } );
    }

    return (
        <div>
            <Header />

            <Container>
                <Row>
                    {currentCards?.map((item, id) => (
                        <Col sm="4" md="4" key={id+1} >
                            <Card className='m-1'>
                                <CardBody>
                                <Row>
                                    <Col xs="8" sm="8" md="8">
                                        <CardTitle tag="h6">{item?.date}</CardTitle>                  
                                        {/* <CardBody className='fixed-card-body' >
                                            <img src={item?.logo} className='' key='1' />
                                        </CardBody> */}
                                        <CardTitle tag="h9">{item?.invoiceType}</CardTitle> 
                                        <CardText className='d-flex fixed-card-text'>{'INV'} <HashtagIcon className="h-6 w-6 text-gray-500" />{':'}{item?.invoiceNumber}</CardText>
                                    </Col>
                                    <Col xs="4" sm="4" md="4" className="position-relative">
                          
                                        <EyeIcon className="absolute top-0 dash-view-icon right-0 h-6 w-6 text-blue-500" onClick={()=> storeInvoiceRecord(item)} />

                                        <TrashIcon className="absolute top-8 right-0 h-5 w-6 text-red-500" onClick={()=> removeInvoiceRecord(item, id)} />
                                    </Col>
                                    </Row>

                                </CardBody>
                                {/* <CardFooter className='fixed-card-footer'> */}
                                    {/*  */}
                                    {/* <Button className='bg-text-wp wp-cursor-pointer m-2' color='secondary' onClick={() => { setModal2(true); setEditFormData(item) }} > Modify </Button> */}
                                    {/* <Button className='bg-text-shop-wp wp-cursor-pointer m-2' onClick={(e) => { setEditFormData(item); deleteShop(e, item) }} > Delete </Button> */}
                                    {/* <Button className='bg-text-wp wp-cursor-pointer m-2' color='secondary' onClick={() => itemStockPage(item)}> Product </Button> */}
                                {/* </CardFooter> */}
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className='custom-iv-ps'>
                    <Col className=' custom-inv-page-col'>
                    <Pagination
                        aria-label="Page navigation example"
                        style={{ marginTop: '20px', justifyContent: 'center' }} // Inline styles for the entire pagination
                        className="custom-pagination mb-9" >
                        <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                                first
                                href="#"
                                onClick={() => handlePageChange(1)}
                                style={{ color: '#000' }} // Inline style for individual links
                                className="custom-pagination-link" // Apply custom CSS class
                            >
                                {1}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === 1}>
                            <PaginationLink
                                previous
                                href="#"
                                onClick={() => handlePageChange(currentPage - 1)}
                                style={{ color: '#000' }}
                                className="custom-pagination-link"
                            />
                        </PaginationItem>

                        {[...Array(totalPages)]?.map((_, i) => (
                            
                            i + 1 === currentPage ?
                            <PaginationItem 
                                active={i + 1 === currentPage} 
                                key={i+1} >
                                <PaginationLink
                                    href="#"
                                    onClick={() => handlePageChange(i + 1)}
                                    style={i + 1 === currentPage ? { backgroundColor: 'gray', color: 'white' } : { color: '#000' }} // Inline style for active and non-active links
                                    className="custom-pagination-link"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                            : ""
                        ))}

                        <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink
                                next
                                href="#"
                                onClick={() => handlePageChange(currentPage + 1)}
                                style={{ color: '#000' }}
                                className="custom-pagination-link"
                            />
                        </PaginationItem>
                        <PaginationItem disabled={currentPage === totalPages}>
                            <PaginationLink
                                last
                                href="#"
                                onClick={() => handlePageChange(totalPages)}
                                style={{ color: '#000' }}
                                className="custom-pagination-link"
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </Pagination>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
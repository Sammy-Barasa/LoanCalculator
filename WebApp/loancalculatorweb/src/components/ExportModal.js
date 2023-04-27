import React,{useState,useEffect} from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';
// import { useHistory } from "react-router-dom"
// import StateContext from '../../Context/stateContext'


const ExportModal = ({data,label_name,product_title}) => {

    
    const [open, setOpen] = useState(false)

    useEffect(()=>{

    },[])




    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const fileExtension = '.xlsx';



    const exportToCSV = (csvData, fileName) => {

        const ws = XLSX.utils.json_to_sheet(csvData);

        const wb = { Sheets: { 'Loan evaluation': ws }, SheetNames: ['Loan evaluation'] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], {type: fileType});

        FileSaver.saveAs(data, fileName + fileExtension);
    }
    

    
    let timeStamp = Date.now()
    // let fileNameConstructed = `Exam records at${wassignedBy} for ${Month},${year}_${timeStamp}`
    let fileNameConstructed = `Loan evaluation ${label_name} for ${product_title}_${timeStamp}`

    const handleExport=(e)=>{
        e.preventDefault()
        
        exportToCSV(data, fileNameConstructed)
        setOpen(false)
    }
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button color="green" button><Icon name='external' />Export to  excel sheet</Button>}
            >
            <Modal.Header>{`Loan evaluation for bank: ${label_name}`}</Modal.Header>
            <Modal.Content image>
                <Icon name="file excel" size="massive" color="green"/>
                <Modal.Description>
                    <Header>{`${product_title} evaluation results`}</Header>
                    <p>
                        {`The evaluation Log to be downloaded as excel sheet, do you wish to proceed to proceed?`}
                    </p>
                    
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={() => setOpen(false)}>
                <Icon name='remove' /> Cancel
                </Button>
                <Button color='green' onClick={handleExport}>
                <Icon name='external square' /> Export
                </Button>
            </Modal.Actions>
    </Modal>
    )
}

export default ExportModal
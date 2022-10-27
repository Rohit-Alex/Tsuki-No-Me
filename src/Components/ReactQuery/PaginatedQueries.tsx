import { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Button, Input } from 'antd'
import { useReactPaginatedQueryContext } from '../../Context/ReactQueryPaginatedContext'
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material'
import ActionModal from './AdditinPopup'
import { useAddColorHook } from '../../Context/ReactQueryCustomHooks/usePaginationReactQuery'



export const PaginatedQueriesPage = () => {
  const [colorVal, setColorVal] = useState('')
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const {isLoading, isError, error, data, isFetching, page, setPage, pageSize, setPageSize} = useReactPaginatedQueryContext()

  const { mutate: addMutate } = useAddColorHook(page)

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  if (isError) {
    return <h2>{(error as any).message}</h2>
  }

  const addColor = () => {
    setColorVal('')
    addMutate({label: colorVal})
  }

  const handleModalClose = () => setActionModalOpen(false)

const colmn = [{
  field: 'id',
  headerName: 'ID',
  sortable: false,
  width: 160,
},
{
  field: 'label',
  headerName: 'Label',
  sortable: false,
  width: 160,
},
{
  field: 'Action',
  headerName: 'Action',
  sortable: false,
  width: 160,
  renderCell: (params: any) => (
      <Button
        color="primary"
        size="small"
        style={{ marginLeft: 16 }}
        onClick={()=> setActionModalOpen(params.id)}
      >
        Click for action
      </Button>
  ),
}]



  return (
    <>
    <div style={{display:'flex', columnGap: '20px', width: '30%', marginTop: '20px'}}>
      <Input placeholder='Add color' value={colorVal} onChange={(e: any)=>setColorVal(e.target.value)}/>
      <Button onClick={addColor}>Add color</Button>
    </div>
    <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            loading={isLoading}
            page={page - 1} // current page. starts with 0
            onPageChange={(newPage) => {console.log('changing page to --->>', newPage, 7984); setPage(newPage + 1)}} // when changing page
            pageSize={pageSize} //no of data being shown currently
            rowsPerPageOptions={[2, 5, 10]} // dropdown allowing to show no of pages
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} //on changing no of rows to show
            rowCount={100} //means in total there are 100 data
            pagination
            rows={data?.data}
            columns={colmn}
            paginationMode="server"
          />
        </Box>
      {actionModalOpen && <ActionModal color={actionModalOpen} handleClose={handleModalClose}/>}
      {isFetching && 'Loading'}
    </>
  )
}
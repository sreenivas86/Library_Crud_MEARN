import React from 'react';
import LibraryTable from './LibraryTable';
import { Route, Routes } from 'react-router-dom';
import AddBook from './AddBook';
import AddLibraryRecord from './AddLibraryRecord';
import StudentTable from './StudentTable';
import EditLibraryForm from './EditLibraryForm';
import UploadForm from './UpoadForm';
import EditStudent from './EditStudent';
import BookTable from './BookTable';
import EditBook from './EditBook';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LibraryTable />} />
      <Route path="/library/add" element={<AddLibraryRecord/>} />
      <Route path="/library/edit/:id" element={<EditLibraryForm />} />

      <Route path='/students' element={<StudentTable/>}/>
      <Route path='/student/add' element={<UploadForm/>}/>
      <Route path="/student/edit/:id" element={<EditStudent/>} />
      
      <Route path='/books' element={<BookTable/>}/>
      <Route path='/book/add' element={<AddBook/>}/>
      <Route path="/book/edit/:id" element={<EditBook/>} />
      
    </Routes>
  );
}

export default AppRoutes;

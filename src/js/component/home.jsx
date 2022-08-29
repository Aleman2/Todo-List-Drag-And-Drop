import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Home = () => {
  let arr = [];
  const [array, setArray] = useState([]);
  const [erase, setErase] = useState(false);


  function PutRemove(i){
    fetch('https://assets.breatheco.de/apis/fake/todos/user/alesanchezr', {
      method: "PUT",
      body: JSON.stringify(i),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        return resp.json(); 
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });
  }

  function Get(){
    fetch('https://assets.breatheco.de/apis/fake/todos/user/alesanchezr', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        return resp.json(); 
    })
    .then(data => {
      setArray(data)
        console.log(data); 
    })
    .catch(error => {
        console.log(error);
    });
  }


  useEffect(()=>{
    Get()
  
  },[])
  
  useEffect(() => {
    console.log(erase)
    if (erase || erase ===0) {
      let newArray = array.filter((element, i) => i != erase);
      newArray.length == 0?newArray = [{label:"no hay tareas",done:true}]:"";
      setArray(newArray);
      PutRemove(newArray)
      setErase(false)
    }
  }, [erase]);

  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedList = [...array];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    PutRemove(updatedList)
    setArray(updatedList);
  };
  return (
    <>
      <div className="container">
        <div className="p-5 d-flex  justify-content-center">
          <input
            className="w-75"
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                arr = [...array, {label: e.target.value, done: false }]
                let newArray = arr.filter((element) => element.done != true);
                setArray(newArray);
                e.target.value = "";
                PutRemove(newArray)
              }
            }}
          />
        </div>
      </div>
      <DragDropContext onDragEnd={handleDrop}>
        <Droppable droppableId="list-container">
          {(provided) => (
            <div
              className="list-container container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {array.map((objects, i) => (
                <Draggable
                  key={i}
                  draggableId={objects.label}
                  index={i}
                >
                  {(provided) => (
                    <div className="row  pt-3 pb-3 d-flex justify-content-center">
                      <div
                        className="children col-6 d-flex justify-content-between"
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        {objects.label}
                        <button
                  
                          onClick={() => setErase(i)}
                        >
                          borrar
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default Home;

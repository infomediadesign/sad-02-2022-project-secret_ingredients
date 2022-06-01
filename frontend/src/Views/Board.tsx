import React, { useCallback, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import CSS from 'csstype';
import { Issue, IssueListTemp, getIssues } from '../ViewModels/Board';
import produce from 'immer';
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggingStyle,
    Droppable,
    DropResult,
    NotDraggingStyle,
} from 'react-beautiful-dnd';

const horizontalList: CSS.Properties = {
    float: 'left',
    padding: '0.8rem',
    border: 'dotted',
    margin: '0.2rem',
};

const issueStyle: CSS.Properties = {
    padding: '0.2rem',
    border: 'dotted',
    margin: '0.1rem',
};

const dragReducer = produce((state: any, action: any) => {
    switch (action.type) {
        case 'MOVE': {
            state[action.from] = state[action.from] || [];
            state[action.to] = state[action.to] || [];
            const [removed] = state[action.from].splice(action.fromIndex, 1);
            state[action.to].splice(action.toIndex, 0, removed);
            return;
        }
        case 'ADDITEM': {
            let itemRef = action.pass;
            test[action.myIndex] = new Array();
            if (action.myData != null && action.myData.length > 0) {
                action.myData.map((item: Issue) => {
                    test[action.myIndex].push(item);
                });
            }

            console.log(action.pass);
            issueIdIncrement++;
            test[action.myIndex].push({
                id: issueIdIncrement.toString(),
                content: 'Test' + issueIdIncrement.toString(),
            });
            let testL: Issue[] = Array.from(test[action.myIndex]);
            let wird = { items: test[0], items2: test[1], items3: test[2] };
            return wird;
        }
        case 'UPDATE': {
            test[0] = action.myData1;
            test[1] = action.myData2;
            test[2] = action.myData3;

            return issueListsNames.map((item) => {
                return { [item]: test[0] };
            });
        }
        case 'UPDATELISTS': {
            let wird = issueListsNames.map((item, index) => {
                return { [item]: state[item] };
            });
            console.log(wird);

            return wird;
        }
        default:
            throw new Error();
    }
});

let issueIdIncrement = 6;
let issueListsNames: string[] = ['items', 'items2', 'items3'];

function App() {
    const [test, setTest] = useState(data);
    const [state, dispatch] = useReducer(dragReducer, initialState);

    function useCallback(result: any) {
        if (result.reason === 'DROP') {
            if (!result.destination) {
                return;
            }
            dispatch({
                type: 'MOVE',
                from: result.source.droppableId,
                to: result.destination.droppableId,
                fromIndex: result.source.index,
                toIndex: result.destination.index,
            });
        }
    }

    return (
        <div>
            <button
                onClick={() => {
                    issueListsNames.push('items' + issueIdIncrement++);
                    dispatch({ type: 'UPDATELISTS', me: state });
                }}
            >
                Add Issue List
            </button>
            <DragDropContext
                onDragEnd={(e) => {
                    useCallback(e);
                }}
            >
                {issueListsNames.map((item, index) => {
                    return arrangeDataInDragDropList(state, item, index);
                })}
            </DragDropContext>
        </div>
    );

    function arrangeDataInDragDropList(state: any, item: string, index: number) {
        return (
            <Droppable droppableId={'items' + index} type="PERSON">
                {(provided, snapshot) => {
                    return arrangeDragDropForIssueList(provided, state, state[item], index);
                }}
            </Droppable>
        );
    }

    function arrangeDragDropForIssueList(provided: any, state: any, mapItem: Issue[], index: any): JSX.Element {
        return (
            <div style={horizontalList} ref={provided.innerRef} {...provided.droppableProps}>
                {mapItem?.map((issue: Issue, index: number) => arrangeIssueInList(issue, index))}
                {provided.placeholder}
                <button
                    onClick={() => {
                        dispatch({
                            type: 'UPDATE',
                            myData1: state.items,
                            myData2: state.items2,
                            myData3: state.items3,
                        });
                        dispatch({ type: 'ADDITEM', pass: 'items', myIndex: 0, myData: state.items });
                    }}
                >
                    Add Issue
                </button>
            </div>
        );
    }
}

function arrangeIssueInList(issue: Issue, index: number) {
    return (
        <Draggable key={issue.id} draggableId={issue.id} index={index}>
            {(provided, snapshot) => arrangeIssue(provided, issue)}
        </Draggable>
    );
}

function arrangeIssue(provided: DraggableProvided, issue: Issue) {
    return (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div style={issueStyle}>
                <span>{issue.content + ' '}</span>
                <button>Delete</button>
            </div>
        </div>
    );
}

export const data: Issue[] = [
    {
        id: '1',
        content: 'This list is buggy',
    },
    {
        id: '2',
        content: 'I hate lists like this...',
    },
    {
        id: '3',
        content: 'Why would react do this to me',
    },
    {
        id: '4',
        content: 'HAMBURGER PLEAAAAAAAAAAAAAAAASE',
    },
];

export const data2: Issue[] = [
    {
        id: '5',
        content: 'This list is buggy',
    },
];
const initialState = { items: data };
let test: Issue[][] = new Array();

export default App;

ReactDOM.render(<App />, document.getElementById('root'));

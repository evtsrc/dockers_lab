function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Host />
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function Host() {
    const [host, setHost] = React.useState(null);

    React.useEffect(() => {
        fetch('/hostname')
        .then(r => r.json())
        .then(h => {
            setHost(h.host);
        });
    }, []);

    return (
        <div><span>HOSTNAME: </span><span>{host}</span></div>
    )
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);
    
    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    /** Descomentar para LAB-FAAS: Añade las nuevas tareas generadas desde la función lambda */
    /**const onNewItems = React.useCallback(
        newItems => {
            setItems(items.concat(newItems));
        },
        [items],
    );**/

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {
            /** LAB-FAAS: componente que añade un input y un botón. Busca y habilita el componente en el código.
            < AddFaaSForm onNewItems={onNewItems} />*/
            }
            {items.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={
                            item.completed
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <i
                            className={`far ${
                                item.completed ? 'fa-check-square' : 'fa-square'
                            }`}
                        />
                    </Button>
                </Col>
                <Col xs={10} className="name">
                    {item.name}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
/*function AddFaaSForm({ onNewItems }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [number, setNumber] = React.useState('');
    const [calling, setCalling] = React.useState(false);

    const getFaas = e => {
        e.preventDefault();
        setCalling(true);
        fetch(**llama al API desde aquí**, {
            method: ,
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(items => {
                onNewItems(items)
                setCalling(false);
                setNumber(0);
            });
    };

    return (
        <Form onSubmit={getFaas}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={number}
                    
                    onChange={e => setNumber(e.target.value)}
                    type="number"
                    placeholder="0"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!number.length}
                        className={calling ? 'disabled' : ''}
                    >
                        {calling ? 'calling...' : 'FaaS'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}*/

ReactDOM.render(<App />, document.getElementById('root'));

import { useState } from 'react';
import { Drawer } from 'antd';
import { FaMinus } from "react-icons/fa";
import { createStyles } from 'antd-style';
import { FaChevronLeft } from "react-icons/fa";
import axios from 'axios';

const useStyle = createStyles(({ token }) => ({
    'my-drawer-header': {
        background: token['cyan7'],
    },
}));

const SegmentComponent = ({ openSegment, setOpenSegment }) => {
    const { styles } = useStyle();
    const [segmentData, setSegmentData] = useState();
    const [selectedSchemas, setSelectedSchemas] = useState([]);

    const classNames = {
        header: styles['my-drawer-header'],
        footer: styles['my-drawer-footer'],
    };

    const drawerStyle = {
        header: {
        },
        footer: {
            background: ""
        }
    }

    const addNewSchema = () => {
        if (!segmentData) return;

        if (!selectedSchemas.includes(segmentData)) {
            setSelectedSchemas([...selectedSchemas, segmentData]);
        }
    }

    const removeSchema = (index) => {
        const updatedSchemas = selectedSchemas.filter((_, i) => i !== index);
        setSelectedSchemas(updatedSchemas);
    }

    const saveTheSegment = async () => {
        try {
            const filteredSchemas = segmentsSchemaList.filter((option) => selectedSchemas.includes(option.value)).map((option) => ({ [option.value]: option.label }));
            console.log('filteredSchemas =>', filteredSchemas);

            const segmentPayload = {
                "segment_name": "last_10_days_blog_visits",
                "schema": filteredSchemas
            }

            console.log('segmentPayload =>', segmentPayload);
            const response = await axios.post('/api', segmentPayload);
            console.log('response =>', response);
            if (response.status === 200) {
                alert('Segment saved successfully!');
                colseDrawer();
            }
        } catch (error) {
            console.error('Error saving segment:', error);
            alert('Failed to save segment. Please try again.');
        }
    }

    const colseDrawer = () => {
        setOpenSegment(false);
        setSelectedSchemas([]);
        setSegmentData();
    }

    const availableMainOptions = segmentsSchemaList.filter((option) => !selectedSchemas.includes(option.value));

    return (
        <Drawer
            closable={false}
            destroyOnHidden
            title={<div className='flex items-center gap-3 text-white'> <FaChevronLeft /> Saving Segment</div>}
            placement="right"
            open={openSegment}
            footer={<div>
                <button className='save-btn' onClick={saveTheSegment}>Save the Segment</button>
                <button className='cancel-btn' onClick={colseDrawer}>Cancel</button>
            </div>}
            onClose={colseDrawer}
            classNames={classNames}
            style={drawerStyle}>
            <div>
                <label>Enter the Name of the Segment</label>
                <input type="text" className='form-control' placeholder='Name of the Segment' />
            </div>
            <p>To save your segment, you need to add schemas to build the query</p>
            {
                selectedSchemas.length > 0 && (
                    <div className='flex items-center justify-end gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className='circle circle-user-traits'></div> - User Traits
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='circle circle-group-traits'></div> - Group Traits
                        </div>
                    </div>)

            }
            <div className={`${selectedSchemas.length > 0 ? 'selected-schemas-container' : ''}`}>
                {
                    selectedSchemas.length > 0 && selectedSchemas.map((schema, index) => {

                        const availableOptionsForThisDropdown = segmentsSchemaList.filter((option) =>
                            !selectedSchemas.includes(option.value) ||
                            option.value === schema
                        );

                        return <div key={index} className='flex gap-2 items-center mb-2 mt-2'>
                            <div className={`circle ${schema === 'account_name' ? 'circle-group-traits' : 'circle-user-traits'}`}></div>
                            <select className='form-control' value={schema} onChange={(e) => {
                                const updatedSchemas = [...selectedSchemas];
                                updatedSchemas[index] = e.target.value;
                                setSelectedSchemas(updatedSchemas);
                            }}>
                                <option value="" hidden>Select schema</option>
                                {availableOptionsForThisDropdown.map((schemaOption) => (
                                    <option key={schemaOption.value} value={schemaOption.value}>{schemaOption.label}</option>
                                ))}
                            </select>
                            <div className='remove-container' onClick={() => removeSchema(index)}><FaMinus /></div>
                        </div>
                    })
                }
            </div>
            <div className='flex gap-2 items-center'>
                <div className='circle'></div>
                <select className='form-control' onChange={(e) => setSegmentData(e.target.value)} >
                    <option value="" hidden>Add schema to segment</option>
                    {availableMainOptions.map((schema) => (
                        <option key={schema.value} value={schema.value}>{schema.label}</option>
                    ))}
                </select>
                <div className='remove-container'><FaMinus /></div>
            </div>
            <span className='text-underline ms-5' onClick={addNewSchema}>+ Add new schema</span>
        </Drawer>
    )
}

export default SegmentComponent;

const segmentsSchemaList = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
]
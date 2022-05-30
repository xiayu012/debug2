import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import Error from '../components/Error';
import Meals from '../components/Meals';
import Bookings from '../components/Bookings';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { spy } from 'sinon';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

configure({ adapter: new Adapter() });

describe('Hacker Hostel <App />', () => {

  it('application renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('check if meals schedule is generated for valid entries', () => {
    const wrapper = mount(<App />);
    const bookings = wrapper.find(Bookings).instance();
    bookings.handleGuestInfo({ target: { value: 'John Doe\nJohhny Alsodoes' } });
    bookings.handleDateInfo({ target: { value: '2018-09-15 to 2018-09-16\n2018-09-14 to 2018-09-15' } });
    wrapper.find(Button).simulate('click');
    const content = wrapper.text();
    // TODO: validate the order as well
    expect(content).toContain("Breakfast for Johhny Alsodoes on 2018-9-14")
    expect(content).toContain("Lunch for Johhny Alsodoes on 2018-9-14")
    expect(content).toContain("Dinner for Johhny Alsodoes on 2018-9-14")
    expect(content).toContain("Breakfast for John Doe on 2018-9-15")
    expect(content).toContain("Breakfast for Johhny Alsodoes on 2018-9-15")
    expect(content).toContain("Lunch for John Doe on 2018-9-15")
    expect(content).toContain("Lunch for Johhny Alsodoes on 2018-9-15")
    expect(content).toContain("Dinner for John Doe on 2018-9-15")
    expect(content).toContain("Dinner for Johhny Alsodoes on 2018-9-15")
    expect(content).toContain("Breakfast for John Doe on 2018-9-16")
    expect(content).toContain("Lunch for John Doe on 2018-9-16")
    expect(content).toContain("Dinner for John Doe on 2018-9-16")
    expect(content).not.toContain("Error! No menu generated for Johhny Alsodoes")
    expect(content).not.toContain("Error! No menu generated for John Doe")
  });

  it('check if meals schedule is generated for valid entries in right order', () => {
    const wrapper = mount(<App />);
    const bookings = wrapper.find(Bookings).instance();
    bookings.handleGuestInfo({ target: { value: 'John Doe\nJohhny Alsodoes' } });
    bookings.handleDateInfo({ target: { value: '2018-09-15 to 2018-09-15\n2018-09-15 to 2018-09-15' } });
    wrapper.find(Button).simulate('click');
    const content = wrapper.text();
    // TODO: validate the order as well
    expect(content).toContain("Breakfast for John Doe on 2018-9-15Breakfast for Johhny Alsodoes on 2018-9-15Lunch for John Doe on 2018-9-15Lunch for Johhny Alsodoes on 2018-9-15Dinner for John Doe on 2018-9-15")
    expect(content).not.toContain("Error! No menu generated for Johhny Alsodoes")
    expect(content).not.toContain("Error! No menu generated for John Doe")
  });

  it('check if meals schedule is generated when one of the date ranges is invalid', () => {
    const wrapper = mount(<App />);
    const bookings = wrapper.find(Bookings).instance();
    bookings.handleGuestInfo({ target: { value: 'John Doe\nJohhny Alsodoes' } });
    bookings.handleDateInfo({ target: { value: '2017-09-15 to 2017-09-15\nInvalid date' } });
    wrapper.find(Button).simulate('click');
    const content = wrapper.text();
    expect(content).toContain("Error! No menu generated for Johhny Alsodoes")
    expect(content).not.toContain("Error! No menu generated for John Doe")
    expect(content).toContain("Breakfast for John Doe on 2017-9-15")
    expect(content).toContain("Lunch for John Doe on 2017-9-15")
    expect(content).toContain("Dinner for John Doe on 2017-9-15")
  });

  it('check if no meals schedule is generated when both the date ranges are invalid', () => {
    const wrapper = mount(<App />);
    const bookings = wrapper.find(Bookings).instance();
    bookings.handleGuestInfo({ target: { value: 'John Doe\nJohhny Alsodoes' } });
    bookings.handleDateInfo({ target: { value: '2017-09-17 to 2017-09-15\n2017-13-17 to 2017-09-1' } });
    wrapper.find(Button).simulate('click');

    const content = wrapper.text();
    expect(content).toContain("Error! No menu generated for Johhny Alsodoes")
    expect(content).toContain("Error! No menu generated for John Doe")
    expect(content).not.toContain("Breakfast for John Doe on 2017-9-17");
  });

  it('check meals schedule when input is empty', () => {
    const wrapper = mount(<App />);
    const bookings = wrapper.find(Bookings).instance();
    bookings.handleGuestInfo({ target: { value: '' } });
    bookings.handleDateInfo({ target: { value: '' } });
    wrapper.find(Button).simulate('click');
    expect(wrapper.text()).toEqual('Hacker HostelGet Meals Schedule');
  });
});

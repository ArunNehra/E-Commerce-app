import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,

} from "@material-ui/core";
import {Link} from 'react-router-dom';
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./FormInput";
import { commerce } from "../../lib/commerce";
const AddressForm = ({ checkoutToken, next }) => {
  const methods = useForm();

  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisons, setshippingSubdivisons] = useState([]);
  const [shippingSubdivison, setshippingSubdivison] = useState("");
  const [shippingOptions, setshippingOptions] = useState([]);
  const [shippingOption, setshippingOption] = useState("");
  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));

  const subdivisions = Object.entries(shippingSubdivisons).map(
    ([code, name]) => ({
      id: code,
      label: name,
    })
  );

  const options = shippingOptions.map((sO) => ({id: sO.id, label:`${sO.description} - (${sO.price.formatted_with_symbol})`}) )
  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setshippingSubdivisons(subdivisions);
    setshippingSubdivison(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, region = null ) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
    setshippingOptions(options);
    console.log(options);
    setshippingOption(options[0].id)
  }

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);


  useEffect(() => {
    shippingCountry && fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(()=>{
    shippingSubdivison && fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivison);
  }, [shippingSubdivison])
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivison, shippingOption}))}>
          <Grid container spacing={3}>
            <FormInput  name="firstName" label="First name" />
            <FormInput  name="lastName" label="Last name" />
            <FormInput  name="address" label="Address" />
            <FormInput  name="email" label="Email" />
            <FormInput  name="city" label="City" />
            <FormInput  name="zip" label="ZIP / Postal code" />
            <Grid item xs={12} sm={6} spacing={3}>
              <InputLabel>Shipping Country</InputLabel>
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select
                value={shippingSubdivison}
                fullWidth
                onChange={(e) => setshippingSubdivison(e.target.value)}
              >
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item  xs={12} sm={6}>
                <InputLabel>Shipping Options</InputLabel>
                <Select value={shippingOption} fullWidth onChange={(e) => setshippingOption(e.target.value)}>
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
                </Select>
            </Grid>
          </Grid>
          <br/>
          <div style={{display:'flex', justifyContent:'space-between'}}>
          <Button variant='outlined' component={Link} to='/cart'>Back to Cart</Button>
          <Button type='submit' variant='contained' color='primary'>Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;

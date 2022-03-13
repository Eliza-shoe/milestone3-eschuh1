let test_var = Object.keys(data).map((review) => (

    <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
    > <div>
            <TextField
                id="outlined-multiline-flexible"
                label={data[review].movie}
                multiline
                maxRows={4}
                defaultValue={data[review].comment}
            /></div>
    </Box>

))
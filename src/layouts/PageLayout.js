import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    Stack,
    styled,
    Typography
} from "@mui/material";
import JsonView from "@uiw/react-json-view";
import {darkTheme} from "@uiw/react-json-view/dark";
import {Download, FileUpload, Delete} from "@mui/icons-material";
import {_downloadCSV, _downloadJson} from "../api/services";
import useDataContext from "../dataContext/useDataContext";

const CardContentNoPadding = styled(CardContent)(
    `
    padding-top: 0;
    &:last-child {
        padding-bottom: 0;
    }
    `
)

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function PageLayout({children, loading, setLoading}) {

    const {results, setResults} = useDataContext()

    const path = window.location.pathname

    const handleDelete = () => {
        setResults(null)
        window.history.replaceState({}, '')
    }

    const handleFileChange = (e) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            const content = e.target.result
            setResults(JSON.parse(content))
        }
        fileReader.readAsText(e.target.files[0])
    }

    const downloadJson = async () => {
        setLoading && setLoading(true)
        const response = await _downloadJson(results)
        const href = window.URL.createObjectURL(response)
        const anchor = document.createElement('a')
        anchor.href = href
        anchor.download = "jsonLog.json"
        anchor.click()
        window.URL.revokeObjectURL(href)
        setLoading && setLoading(false)
    }

    const downloadCSV = async () => {
        setLoading && setLoading(true)
        const response = await _downloadCSV(results)
        const href = window.URL.createObjectURL(response)
        const anchor = document.createElement('a')
        anchor.href = href
        anchor.download = "jsonLog.csv"
        anchor.click()
        window.URL.revokeObjectURL(href)
        setLoading && setLoading(false)
    }

    return (
        <Box display="flex" justifyContent="center" marginTop={5} paddingX={5} height="100%">
            <Grid container spacing={2}>
                <Grid item lg={6} md={12} width="100%">
                    {children}
                </Grid>
                <Grid item lg={6} md={12} width="100%">
                    <Stack spacing={1}>
                        <Card sx={{minWidth: "500px", height: "500px"}}>
                            <CardHeader title="Contract Logs"
                                        action={
                                            <Button disabled={!results} color="error" startIcon={<Delete/>} onClick={handleDelete}/>
                                        }
                            />
                            <CardContentNoPadding sx={{height: "calc(100% - 112px)", overflow: "auto"}}>
                                {
                                    loading ? (
                                            <Box width="100%" height="100%" display="flex" justifyContent="center"
                                                 alignItems="center">
                                                <CircularProgress/>
                                            </Box>
                                        ) :
                                        results &&
                                            (
                                                <>
                                                    <JsonView value={results} style={darkTheme} width="100%"/>
                                                </>
                                            )
                                }
                            </CardContentNoPadding>
                        </Card>
                        {
                            path === "/ocel" ? (
                                    <Box display="flex" justifyContent="center">
                                        <Button component="label" variant="contained" startIcon={<FileUpload/>}
                                                sx={{padding: 1}}>
                                            Upload File
                                            <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
                                        </Button>
                                    </Box>
                                )
                                : (
                                    <Box display="flex" justifyContent="space-evenly" alignItems="center" gap={1}>
                                        <Button disabled={!results} startIcon={<Download/>} onClick={downloadJson}
                                                variant="contained" sx={{padding: 1, width: 120}}>
                                            <Typography variant="h6">JSON</Typography>
                                        </Button>
                                        <Button disabled={!results} startIcon={<Download/>} onClick={downloadCSV}
                                                variant="contained" sx={{
                                            padding: 1,
                                            width: 120,
                                            backgroundColor: "#38a651",
                                            '&:hover': {backgroundColor: "#2f6749"}
                                        }}>
                                            <Typography variant="h6">CSV</Typography>
                                        </Button>
                                    </Box>
                                )
                        }
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PageLayout;
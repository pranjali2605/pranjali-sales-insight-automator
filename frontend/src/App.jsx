import { useState } from "react"
import axios from "axios"

function App() {

  const [file, setFile] = useState(null)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [statusType, setStatusType] = useState("")

  const handleUpload = async () => {

    if (!file || !email) {
      setStatusType("error")
      setStatus("Please select a file and enter an email")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("email", email)

    try {

      setLoading(true)
      setStatusType("info")
      setStatus("Processing sales data...")

      const response = await axios.post(
        "http://localhost:8000/upload",
        formData
      )

      setStatusType("success")
      setStatus(response.data.message)
      setSummary(response.data.summary)

    } catch (error) {

      console.error(error)

      if (error.response) {
        setStatusType("error")
        setStatus("Server error: " + error.response.data.detail)
      }
      else if (error.request) {
        setStatusType("error")
        setStatus("Request sent but response not received")
      }
      else {
        setStatusType("error")
        setStatus("Error: " + error.message)
      }

    } finally {
      setLoading(false)
    }
  }

  const statusColor = {
    success: "#2e7d32",
    error: "#c62828",
    info: "#1565c0"
  }

  return (

    <div style={{
      fontFamily: "Arial",
      background: "#f5f7fb",
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* Header */}
      <div style={{
        background: "#1976d2",
        color: "white",
        padding: "18px 40px",
        fontSize: "22px",
        fontWeight: "bold"
      }}>
        Sales Insight Automator
      </div>

      {/* Main Full Screen Layout */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gap: "30px",
        padding: "30px"
      }}>

        {/* LEFT PANEL */}
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          height: "fit-content"
        }}>

          <h3>Upload Dataset</h3>

          <p style={{color:"#666"}}>
            Upload your sales CSV/XLSX dataset to generate AI insights.
          </p>

          <hr style={{margin:"20px 0"}} />

          <label><b>Select File</b></label>

          <input
            type="file"
            style={{marginTop:"10px"}}
            onChange={(e)=>setFile(e.target.files[0])}
          />

          {file && (
            <p style={{fontSize:"14px", color:"#555"}}>
              Selected: {file.name}
            </p>
          )}

          <br/>

          <label><b>Recipient Email</b></label>

          <input
            type="email"
            placeholder="Enter email to receive report"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            style={{
              width:"100%",
              padding:"10px",
              marginTop:"10px",
              borderRadius:"6px",
              border:"1px solid #ccc"
            }}
          />

          <br/><br/>

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              width:"100%",
              padding:"12px",
              background:"#1976d2",
              color:"white",
              border:"none",
              borderRadius:"6px",
              cursor:"pointer",
              fontSize:"16px"
            }}
          >
            {loading ? "Generating Insights..." : "Generate AI Summary"}
          </button>

          <br/><br/>

          {status && (
            <div style={{
              padding:"10px",
              borderRadius:"6px",
              background:"#f4f6f8",
              color: statusColor[statusType],
              fontWeight:"bold"
            }}>
              {status}
            </div>
          )}

        </div>

        {/* RIGHT PANEL */}
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}>

          <h3>AI Generated Report</h3>

          {!summary && (
            <p style={{color:"#777"}}>
              Your AI insights will appear here after processing the dataset.
            </p>
          )}

          {summary && (
            <div style={{
              marginTop:"20px",
              padding:"20px",
              background:"#fafafa",
              border:"1px solid #eee",
              borderRadius:"6px",
              flex:1,
              overflow:"auto"
            }}>
              <pre style={{whiteSpace:"pre-wrap"}}>
                {summary}
              </pre>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default App
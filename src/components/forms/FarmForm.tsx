
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFarm } from "@/context/FarmContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FarmData, CattleData, PastureData } from "@/types/farm";

// Validation schema
const formSchema = z.object({
  // Farm Info
  name: z.string().min(2, "Farm name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  size: z.number().min(1, "Size must be at least 1 hectare"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  
  // Cattle Info
  totalHead: z.number().min(1, "Total head must be at least 1"),
  cattleType: z.string().min(2, "Cattle type must be at least 2 characters"),
  averageWeight: z.number().min(100, "Average weight must be at least 100 kg"),
  methodOfRaising: z.enum(["conventional", "regenerative", "mixed"]),
  
  // Pasture Info
  totalPastures: z.number().min(1, "Total pastures must be at least 1"),
  averagePastureSize: z.number().min(1, "Average pasture size must be at least 1 hectare"),
  rotationsPerSeason: z.number().min(1, "Rotations must be at least 1"),
  restingDaysPerPasture: z.number().min(1, "Resting days must be at least 1"),
  grassTypes: z.string().min(2, "Grass types must be at least 2 characters"),
  soilHealthScore: z.number().min(1, "Soil health score must be at least 1").max(10, "Soil health score must be at most 10").optional(),
  currentForageDensity: z.number().min(1, "Forage density must be at least 1 kg/hectare").optional(),
});

export function FarmForm() {
  const { createFarm } = useFarm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      size: 0,
      ownerName: "",
      totalHead: 0,
      cattleType: "",
      averageWeight: 0,
      methodOfRaising: "conventional",
      totalPastures: 0,
      averagePastureSize: 0,
      rotationsPerSeason: 0,
      restingDaysPerPasture: 0,
      grassTypes: "",
      soilHealthScore: 5,
      currentForageDensity: 0,
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Extract farm data
      const farmData: Omit<FarmData, "id" | "createdAt" | "updatedAt"> = {
        name: data.name,
        location: data.location,
        size: data.size,
        ownerName: data.ownerName,
      };
      
      // Extract cattle data
      const cattleData: Omit<CattleData, "id" | "farmId"> = {
        totalHead: data.totalHead,
        cattleType: data.cattleType,
        averageWeight: data.averageWeight,
        methodOfRaising: data.methodOfRaising,
      };
      
      // Extract pasture data & convert grassTypes string to array
      const pastureData: Omit<PastureData, "id" | "farmId"> = {
        totalPastures: data.totalPastures,
        averagePastureSize: data.averagePastureSize,
        rotationsPerSeason: data.rotationsPerSeason,
        restingDaysPerPasture: data.restingDaysPerPasture,
        grassTypes: data.grassTypes.split(",").map(type => type.trim()),
        soilHealthScore: data.soilHealthScore,
        currentForageDensity: data.currentForageDensity,
      };
      
      // Create the farm
      createFarm(farmData, cattleData, pastureData);
      
      // Navigate to farms list
      navigate("/farms");
    } catch (error) {
      console.error("Error creating farm:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Farm</CardTitle>
        <CardDescription>
          Add information about your farm to get started with regenerative insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Farm Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Green Meadows Ranch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="County, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Size (hectares)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner/Manager Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Cattle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalHead"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Head of Cattle</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cattleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cattle Breed/Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Angus, Hereford, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="averageWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Weight (kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="methodOfRaising"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method of Raising</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="conventional" id="conventional" />
                            <label htmlFor="conventional" className="text-sm">Conventional</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regenerative" id="regenerative" />
                            <label htmlFor="regenerative" className="text-sm">Regenerative</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mixed" id="mixed" />
                            <label htmlFor="mixed" className="text-sm">Mixed Approach</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Pasture & Grazing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalPastures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Pastures/Paddocks</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="averagePastureSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Pasture Size (hectares)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rotationsPerSeason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Rotations Per Season</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="restingDaysPerPasture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Resting Days Per Pasture</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grassTypes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Grass/Forage Types</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter grass types separated by commas (e.g., Fescue, Bluegrass, White Clover)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the grass and forage species in your pastures, separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="soilHealthScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Health Score (1-10, if known)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="5" 
                          min="1"
                          max="10"
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimate the current soil health on a scale of 1-10.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentForageDensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Forage Density (kg/hectare, if known)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimate the current forage production in kg per hectare.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/farms")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-farm-green-700 hover:bg-farm-green-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Farm"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
